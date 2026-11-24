import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import StarRating from '../components/StarRating'
import { useCart } from '../context/CartContext'
import { getProduct } from '../api/client'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [status, setStatus] = useState('loading')
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    setStatus('loading')
    getProduct(id)
      .then((data) => {
        setProduct(data)
        setQuantity(1)
        setStatus('ready')
      })
      .catch(() => setStatus('error'))
  }, [id])

  if (status === 'loading') {
    return <div className="page" />
  }

  if (status === 'error' || !product) {
    return (
      <div className="page">
        <p className="empty-state">Product not found.</p>
        <Link to="/" className="btn btn-secondary">
          Back to shop
        </Link>
      </div>
    )
  }

  const handleAdd = () => {
    addToCart(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="page">
      <button onClick={() => navigate(-1)} className="back-link">
        ← Back
      </button>
      <div className="product-detail">
        <img src={product.image} alt={product.name} className="product-detail-image" />
        <div className="product-detail-info">
          <span className="category-tag">{product.category}</span>
          <h1>{product.name}</h1>
          <StarRating rating={product.rating} />
          <p className="product-detail-price">${product.price.toFixed(2)}</p>
          <p className="product-detail-description">{product.description}</p>
          <p className="stock-note">{product.stock} in stock</p>

          <div className="quantity-row">
            <label htmlFor="quantity">Quantity</label>
            <input
              id="quantity"
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, Math.min(product.stock, Number(e.target.value) || 1)))
              }
            />
          </div>

          <button onClick={handleAdd} className="btn btn-primary" disabled={product.stock === 0}>
            {added ? 'Added ✓' : product.stock === 0 ? 'Out of stock' : 'Add to cart'}
          </button>
        </div>
      </div>
    </div>
  )
}
