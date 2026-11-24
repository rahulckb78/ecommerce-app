import { Router } from 'express'
import { pool } from '../db.js'
import { requireAuth } from '../middleware/requireAuth.js'

export const ordersRouter = Router()

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0
}

ordersRouter.post('/', requireAuth, async (req, res, next) => {
  const { customer, items } = req.body ?? {}

  if (!customer || !['name', 'address', 'city', 'zip'].every((f) => isNonEmptyString(customer[f]))) {
    return res.status(400).json({ error: 'Missing or invalid customer details' })
  }
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' })
  }
  for (const item of items) {
    if (!isNonEmptyString(item?.id) || !Number.isInteger(item?.quantity) || item.quantity < 1) {
      return res.status(400).json({ error: 'Invalid cart item' })
    }
  }

  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const ids = items.map((item) => item.id)
    const { rows: products } = await client.query('SELECT * FROM products WHERE id = ANY($1)', [ids])
    const productById = new Map(products.map((p) => [p.id, p]))

    let total = 0
    const orderLines = []
    for (const item of items) {
      const product = productById.get(item.id)
      if (!product) {
        throw Object.assign(new Error(`Unknown product: ${item.id}`), { status: 400 })
      }
      if (item.quantity > product.stock) {
        throw Object.assign(new Error(`Not enough stock for ${product.name}`), { status: 409 })
      }
      const price = Number(product.price)
      total += price * item.quantity
      orderLines.push({ productId: product.id, name: product.name, price, quantity: item.quantity })
    }

    const { rows: orderRows } = await client.query(
      `INSERT INTO orders (user_id, customer_name, customer_email, address, city, zip, total)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, created_at`,
      [req.user.id, customer.name, req.user.email, customer.address, customer.city, customer.zip, total]
    )
    const orderId = orderRows[0].id

    for (const line of orderLines) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, name, price, quantity)
         VALUES ($1, $2, $3, $4, $5)`,
        [orderId, line.productId, line.name, line.price, line.quantity]
      )
      await client.query('UPDATE products SET stock = stock - $1 WHERE id = $2', [line.quantity, line.productId])
    }

    await client.query('COMMIT')

    res.status(201).json({
      orderId,
      total,
      createdAt: orderRows[0].created_at,
      items: orderLines,
    })
  } catch (err) {
    await client.query('ROLLBACK')
    if (err.status) {
      return res.status(err.status).json({ error: err.message })
    }
    next(err)
  } finally {
    client.release()
  }
})
