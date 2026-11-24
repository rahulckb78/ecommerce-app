import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { items, removeFromCart, setQuantity, totalPrice } = useCart()

  if (items.length === 0) {
    return (
      <div className="page">
        <h1>Your cart</h1>
        <p className="empty-state">Your cart is empty.</p>
        <Link to="/" className="btn btn-primary">
          Browse products
        </Link>
      </div>
    )
  }

  return (
    <div className="page">
      <h1>Your cart</h1>
      <div className="cart-list">
        {items.map((item) => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.name} />
            <div className="cart-item-info">
              <Link to={`/product/${item.id}`} className="cart-item-name">
                {item.name}
              </Link>
              <p className="price">${item.price.toFixed(2)}</p>
            </div>
            <input
              type="number"
              min="1"
              max={item.stock}
              value={item.quantity}
              onChange={(e) => setQuantity(item.id, Number(e.target.value) || 1)}
              className="cart-item-qty"
            />
            <p className="cart-item-subtotal">${(item.price * item.quantity).toFixed(2)}</p>
            <button onClick={() => removeFromCart(item.id)} className="btn btn-link">
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <span>Total</span>
        <span className="cart-total">${totalPrice.toFixed(2)}</span>
      </div>

      <Link to="/checkout" className="btn btn-primary btn-wide">
        Proceed to checkout
      </Link>
    </div>
  )
}
