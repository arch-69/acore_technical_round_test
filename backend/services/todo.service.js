import * as todoRepo from '../repositories/todo.repository.js';

export async function listTodos(userId, query) {
  const page = parseInt(query.page, 10) || 1;
  const limit = Math.min(parseInt(query.limit, 10) || 10, 50);
  const completed = query.completed !== undefined ? query.completed === 'true' : undefined;
  return todoRepo.findByUserId(userId, { page, limit, completed});
}

export async function getTodo(id, userId) {
  const todo = await todoRepo.findById(id);
  if (!todo || todo.userId.toString() !== userId) return null;
  return todo;
}

export async function createTodo(userId, data) {
  return todoRepo.createTodo({ ...data, userId });
}

export async function updateTodo(id, userId, data) {
  const todo = await todoRepo.findById(id);
  if (!todo || todo.userId.toString() !== userId) return null;
  return todoRepo.updateTodo(id, data);
}

export async function deleteTodo(id, userId) {
  const todo = await todoRepo.findById(id);
  if (!todo || todo.userId.toString() !== userId) return null;
  await todoRepo.deleteTodo(id);
  return todo;
}
