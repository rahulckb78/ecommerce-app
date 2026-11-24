import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { signOut, useSession } from '../lib/auth-client'

export default function Navbar() {
  const { totalItems } = useCart()
  const { data: session } = useSession()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          Shopfront
        </Link>
        <nav className="nav-links">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
            Shop
          </NavLink>
          <NavLink to="/cart" className={({ isActive }) => (isActive ? 'active' : '')}>
            Cart
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </NavLink>
          {session ? (
            <>
              <span className="nav-user">{session.user.name || session.user.email}</span>
              <button onClick={handleSignOut} className="btn btn-small btn-secondary">
                Sign out
              </button>
            </>
          ) : (
            <Link to="/sign-in" className="btn btn-small btn-secondary">
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
