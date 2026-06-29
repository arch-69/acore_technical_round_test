import ApiResponse from '../utils/ApiResponse.js';

export default function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    return res.status(400).json(new ApiResponse(400, err.message));
  }

  if (err.code === 11000) {
    return res.status(409).json(new ApiResponse(409, 'Duplicate key error'));
  }

  res.status(500).json(new ApiResponse(500, 'Internal server error'));
}
