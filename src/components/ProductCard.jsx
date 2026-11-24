import { Link } from 'react-router-dom'
import StarRating from './StarRating'
import { useCart } from '../context/CartContext'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-card-image">
        <img src={product.image} alt={product.name} loading="lazy" />
      </Link>
      <div className="product-card-body">
        <Link to={`/product/${product.id}`} className="product-card-name">
          {product.name}
        </Link>
        <StarRating rating={product.rating} />
        <div className="product-card-footer">
          <span className="price">${product.price.toFixed(2)}</span>
          <button onClick={() => addToCart(product, 1)} className="btn btn-small">
            Add to cart
          </button>
        </div>
      </div>
    </div>
  )
}
