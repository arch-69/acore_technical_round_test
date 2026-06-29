import * as todoService from '../services/todo.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

export const list = asyncHandler(async (req, res) => {
  const result = await todoService.listTodos(req.user._id.toString(), req.query);
  res.json(new ApiResponse(200, 'Todos fetched', result));
});

export const getById = asyncHandler(async (req, res) => {
  const todo = await todoService.getTodo(req.params.id, req.user._id.toString());
  if (!todo) {
    return res.status(404).json(new ApiResponse(404, 'Todo not found'));
  }
  res.json(new ApiResponse(200, 'Todo fetched', todo));
});

export const create = asyncHandler(async (req, res) => {
  console.log(req);
  const body = req.body || {};
  if (!body.title?.trim()) {
    return res.status(400).json(new ApiResponse(400, 'Title is required'));
  }
  const { title, description } = body;

  const todo = await todoService.createTodo(req.user._id.toString(), {
    title: title.trim(),
    description: description?.trim() || '',
  });

  res.status(201).json(new ApiResponse(201, 'Todo created', todo));
});

export const update = asyncHandler(async (req, res) => {
  const body = req.body || {};
  const { title, description, completed } = body;
  const data = {};
  if (title !== undefined) data.title = title.trim();
  if (description !== undefined) data.description = description.trim();
  if (completed !== undefined) data.completed = completed;

  const todo = await todoService.updateTodo(req.params.id, req.user._id.toString(), data);
  if (!todo) {
    return res.status(404).json(new ApiResponse(404, 'Todo not found'));
  }
  res.json(new ApiResponse(200, 'Todo updated', todo));
});

export const remove = asyncHandler(async (req, res) => {
  const todo = await todoService.deleteTodo(req.params.id, req.user._id.toString());
  if (!todo) {
    return res.status(404).json(new ApiResponse(404, 'Todo not found'));
  }
  res.json(new ApiResponse(200, 'Todo deleted'));
});
