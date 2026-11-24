import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signUp } from '../lib/auth-client'

export default function SignUp() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    const { error: signUpError } = await signUp.email({
      name: form.name,
      email: form.email,
      password: form.password,
    })
    setSubmitting(false)
    if (signUpError) {
      setError(signUpError.message || 'Could not create account')
      return
    }
    navigate('/', { replace: true })
  }

  return (
    <div className="page auth-page">
      <h1>Create an account</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        <label>
          Full name
          <input name="name" required value={form.name} onChange={handleChange} />
        </label>
        <label>
          Email
          <input type="email" name="email" required value={form.email} onChange={handleChange} />
        </label>
        <label>
          Password
          <input
            type="password"
            name="password"
            required
            minLength={8}
            value={form.password}
            onChange={handleChange}
          />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="btn btn-primary btn-wide" disabled={submitting}>
          {submitting ? 'Creating account...' : 'Sign up'}
        </button>
      </form>
      <p className="auth-switch">
        Already have an account? <Link to="/sign-in">Sign in</Link>
      </p>
    </div>
  )
}
