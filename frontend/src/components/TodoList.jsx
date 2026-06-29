import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../useAuth'
import { getTodos, createTodo, updateTodo, deleteTodo } from '../api'
import TodoItem from './TodoItem'

export default function TodoList() {
  const { idToken, user, signOut } = useAuth()
  const [todos, setTodos] = useState([])
  const [, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const limit = 10

  const fetchTodos = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, limit }
      if (filter !== 'all') params.completed = filter === 'completed' ? 'true' : 'false'
      const data = await getTodos(idToken, params)
      setTodos(data.todos)
      setTotal(data.total)
      setTotalPages(data.totalPages)
    } catch (err) {
      console.error('Failed to fetch todos:', err)
    } finally {
      setLoading(false)
    }
  }, [idToken, page, filter])

  useEffect(() => {
    fetchTodos()
  }, [fetchTodos])

  async function handleCreate(e) {
    e.preventDefault()
    const trimmedTitle = title.trim()
    if (!trimmedTitle) return
    try {
      await createTodo(idToken, { title: trimmedTitle, description: description.trim() })
      setTitle('')
      setDescription('')
      setPage(1)
      fetchTodos()
    } catch (err) {
      console.error('Failed to create todo:', err)
    }
  }

  async function handleToggle(id, completed) {
    try {
      await updateTodo(idToken, id, { completed })
      fetchTodos()
    } catch (err) {
      console.error('Failed to toggle todo:', err)
    }
  }

  async function handleUpdate(id, data) {
    try {
      await updateTodo(idToken, id, data)
      fetchTodos()
    } catch (err) {
      console.error('Failed to update todo:', err)
    }
  }

  async function handleDelete(id) {
    try {
      await deleteTodo(idToken, id)
      fetchTodos()
    } catch (err) {
      console.error('Failed to delete todo:', err)
    }
  }

  function handleFilterChange(newFilter) {
    setFilter(newFilter)
    setPage(1)
  }

  return (
    <div className="todo-app">
      <header className="todo-header">
        <h1>Todo App</h1>
        <div className="header-right">
          {user?.email && <span className="user-email">{user.email}</span>}
          <button onClick={signOut}>Sign Out</button>
        </div>
      </header>

      <form className="todo-form" onSubmit={handleCreate}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          required
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
        />
        <button type="submit">Add</button>
      </form>

      <div className="todo-filters">
        {['all', 'active', 'completed'].map((f) => (
          <button
            key={f}
            className={filter === f ? 'active' : ''}
            onClick={() => handleFilterChange(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="loading">Loading...</p>
      ) : todos.length === 0 ? (
        <p className="empty">No todos found</p>
      ) : (
        <ul className="todo-list">
          {todos.map((todo) => (
            <TodoItem
              key={todo._id}
              todo={todo}
              onToggle={handleToggle}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
