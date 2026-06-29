const BASE_URL = 'http://localhost:5000/api'

async function request(path, options = {}) {
  const { headers: optionHeaders, ...rest } = options
  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: { 'Content-Type': 'application/json', ...optionHeaders },
  })
  const body = await res.json()
  if (!body.success) throw new ApiError(body.message, body.statusCode)
  return body.data
}

export class ApiError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
  }
}

export function login(idToken) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ idToken }),
  })
}

export function getTodos(idToken, { page = 1, limit = 10, completed } = {}) {
  const params = new URLSearchParams({ page, limit })
  if (completed !== undefined) params.set('completed', completed)
  return request(`/todos?${params}`, {
    headers: { Authorization: `Bearer ${idToken}` },
  })
}

export function createTodo(idToken, { title, description }) {
  return request('/todos', {
    method: 'POST',
    headers: { Authorization: `Bearer ${idToken}` },
    body: JSON.stringify({ title, description }),
  })
}

export function updateTodo(idToken, id, data) {
  return request(`/todos/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${idToken}` },
    body: JSON.stringify(data),
  })
}

export function deleteTodo(idToken, id) {
  return request(`/todos/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${idToken}` },
  })
}
