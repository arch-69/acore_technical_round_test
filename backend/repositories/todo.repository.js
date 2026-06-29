import Todo from '../models/todo.model.js';

export async function findByUserId(userId, { page = 1, limit = 10, completed } = {}) {
  const filter = { userId };
  if (completed !== undefined) filter.completed = completed;

  const skip = (page - 1) * limit;
  const [todos, total] = await Promise.all([
    Todo.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Todo.countDocuments(filter),
  ]);

  return { todos, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function findById(id) {
  return Todo.findById(id);
}

export async function createTodo(data) {
  return Todo.create(data);
}

export async function updateTodo(id, data) {
  return Todo.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

export async function deleteTodo(id) {
  return Todo.findByIdAndDelete(id);
}
