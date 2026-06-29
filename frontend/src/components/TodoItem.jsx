import { useState } from 'react'

export default function TodoItem({ todo, onToggle, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(todo.title)
  const [description, setDescription] = useState(todo.description)

  function handleSave() {
    const trimmedTitle = title.trim()
    if (!trimmedTitle) return
    onUpdate(todo._id, { title: trimmedTitle, description: description.trim() })
    setEditing(false)
  }

  function handleCancel() {
    setTitle(todo.title)
    setDescription(todo.description)
    setEditing(false)
  }

  if (editing) {
    return (
      <li className="todo-item editing">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <div className="todo-actions">
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      </li>
    )
  }

  return (
    <li className={`todo-item${todo.completed ? ' completed' : ''}`}>
      <label className="todo-checkbox">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo._id, !todo.completed)}
        />
      </label>
      <div className="todo-content">
        <span className="todo-title">{todo.title}</span>
        {todo.description && (
          <span className="todo-desc">{todo.description}</span>
        )}
      </div>
      <div className="todo-actions">
        <button onClick={() => setEditing(true)}>Edit</button>
        <button className="danger" onClick={() => onDelete(todo._id)}>
          Delete
        </button>
      </div>
    </li>
  )
}
