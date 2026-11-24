import 'dotenv/config'
import express from 'express'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { toNodeHandler } from 'better-auth/node'
import { auth } from './auth.js'
import { productsRouter } from './routes/products.js'
import { ordersRouter } from './routes/orders.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = join(__dirname, '..', 'dist')

const app = express()
app.set('trust proxy', 1)

// Better Auth needs the raw request before express.json() parses the body.
app.all('/api/auth/*splat', toNodeHandler(auth))

app.use(express.json())

app.use('/api/products', productsRouter)
app.use('/api/orders', ordersRouter)

app.use(express.static(distDir))
app.get(/^(?!\/api\/).*/, (req, res) => {
  res.sendFile(join(distDir, 'index.html'))
})

app.use((err, req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`)
})
