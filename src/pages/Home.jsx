import { useEffect, useMemo, useState } from 'react'
import ProductCard from '../components/ProductCard'
import { getProducts } from '../api/client'
import { CATEGORIES } from '../data/products'

export default function Home() {
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState('loading')
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    getProducts()
      .then((data) => {
        setProducts(data)
        setStatus('ready')
      })
      .catch(() => setStatus('error'))
  }, [])

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = category === 'All' || p.category === category
      const matchesSearch = p.name.toLowerCase().includes(search.trim().toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [products, category, search])

  return (
    <div className="page">
      <div className="hero">
        <h1>Shop everything you need</h1>
        <p>Quality products, mock-fast delivery, and a cart that remembers you.</p>
      </div>

      <div className="toolbar">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <div className="category-pills">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`pill ${category === c ? 'pill-active' : ''}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {status === 'loading' && <p className="empty-state">Loading products...</p>}
      {status === 'error' && <p className="empty-state">Couldn't load products. Is the server running?</p>}
      {status === 'ready' && filtered.length === 0 && (
        <p className="empty-state">No products match your search.</p>
      )}
      {status === 'ready' && filtered.length > 0 && (
        <div className="product-grid">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
