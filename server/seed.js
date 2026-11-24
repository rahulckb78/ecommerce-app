import { pool } from './db.js'
import { PRODUCTS } from './data/products.js'

async function seed() {
  for (const p of PRODUCTS) {
    await pool.query(
      `INSERT INTO products (id, name, category, price, rating, image, description, stock)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         category = EXCLUDED.category,
         price = EXCLUDED.price,
         rating = EXCLUDED.rating,
         image = EXCLUDED.image,
         description = EXCLUDED.description,
         stock = EXCLUDED.stock`,
      [p.id, p.name, p.category, p.price, p.rating, p.image, p.description, p.stock]
    )
  }
  console.log(`Seeded ${PRODUCTS.length} products.`)
  await pool.end()
}

seed().catch((err) => {
  console.error('Seeding failed:', err)
  process.exit(1)
})
