import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { signIn } from '../lib/auth-client'

export default function SignIn() {
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from || '/'
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    const { error: signInError } = await signIn.email({ email: form.email, password: form.password })
    setSubmitting(false)
    if (signInError) {
      setError(signInError.message || 'Could not sign in')
      return
    }
    navigate(redirectTo, { replace: true })
  }

  return (
    <div className="page auth-page">
      <h1>Sign in</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        <label>
          Email
          <input type="email" name="email" required value={form.email} onChange={handleChange} />
        </label>
        <label>
          Password
          <input type="password" name="password" required value={form.password} onChange={handleChange} />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="btn btn-primary btn-wide" disabled={submitting}>
          {submitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
      <p className="auth-switch">
        Don't have an account? <Link to="/sign-up">Sign up</Link>
      </p>
    </div>
  )
}
