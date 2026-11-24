async function request(path, options) {
  const res = await fetch(path, options)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `Request failed with status ${res.status}`)
  }
  return res.json()
}

export function getProducts() {
  return request('/api/products')
}

export function getProduct(id) {
  return request(`/api/products/${id}`)
}

export function createOrder(payload) {
  return request('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}
