import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { createOrder } from '../api/client'
import { useSession } from '../lib/auth-client'

const EMPTY_FORM = { name: '', address: '', city: '', zip: '' }

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart()
  const { data: session } = useSession()
  const [form, setForm] = useState(EMPTY_FORM)
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (session?.user?.name) {
      setForm((f) => (f.name ? f : { ...f, name: session.user.name }))
    }
  }, [session])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const payload = {
        customer: form,
        items: items.map((item) => ({ id: item.id, quantity: item.quantity })),
      }
      const result = await createOrder(payload)
      setOrder(result)
      clearCart()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (order) {
    return (
      <div className="page">
        <div className="order-confirmation">
          <h1>Thank you, {form.name.split(' ')[0] || 'friend'}! 🎉</h1>
          <p>
            Order #{order.orderId} placed for ${order.total.toFixed(2)}. A confirmation would normally be
            emailed to {session?.user?.email}.
          </p>
          <Link to="/" className="btn btn-primary">
            Continue shopping
          </Link>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return <Navigate to="/cart" replace />
  }

  return (
    <div className="page">
      <h1>Checkout</h1>
      <div className="checkout-layout">
        <form onSubmit={handleSubmit} className="checkout-form">
          <label>
            Email
            <input value={session?.user?.email || ''} disabled />
          </label>
          <label>
            Full name
            <input name="name" required value={form.name} onChange={handleChange} />
          </label>
          <label>
            Address
            <input name="address" required value={form.address} onChange={handleChange} />
          </label>
          <div className="form-row">
            <label>
              City
              <input name="city" required value={form.city} onChange={handleChange} />
            </label>
            <label>
              ZIP code
              <input name="zip" required value={form.zip} onChange={handleChange} />
            </label>
          </div>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn btn-primary btn-wide" disabled={submitting}>
            {submitting ? 'Placing order...' : `Place order ($${totalPrice.toFixed(2)})`}
          </button>
        </form>

        <div className="order-summary">
          <h2>Order summary</h2>
          {items.map((item) => (
            <div key={item.id} className="order-summary-row">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="order-summary-row order-summary-total">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
