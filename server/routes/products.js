import { Router } from 'express'
import { pool } from '../db.js'

export const productsRouter = Router()

function toProduct(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    price: Number(row.price),
    rating: Number(row.rating),
    image: row.image,
    description: row.description,
    stock: row.stock,
  }
}

productsRouter.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM products ORDER BY name ASC')
    res.json(rows.map(toProduct))
  } catch (err) {
    next(err)
  }
})

productsRouter.get('/:id', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id])
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' })
    }
    res.json(toProduct(rows[0]))
  } catch (err) {
    next(err)
  }
})
