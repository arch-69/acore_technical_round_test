import adminAuth from '../config/firebase.config.js';
import * as userRepo from '../repositories/user.repository.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

export const signup = asyncHandler(async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) {
    return res.status(400).json(new ApiResponse(400, 'idToken is required'));
  }

  const decoded = await adminAuth.verifyIdToken(idToken);
  const existing = await userRepo.findByFirebaseUid(decoded.uid);
  if (existing) {
    return res.status(409).json(new ApiResponse(409, 'User already registered'));
  }

  const user = await userRepo.createUser({
    firebaseUid: decoded.uid,
    email: decoded.email,
    displayName: decoded.name,
    photoURL: decoded.picture,
  });

  res.status(201).json(new ApiResponse(201, 'Registered successfully', user));
});

export const login = asyncHandler(async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) {
    return res.status(400).json(new ApiResponse(400, 'idToken is required'));
  }

  const decoded = await adminAuth.verifyIdToken(idToken);
  const user = await userRepo.findOrCreateUser({
    firebaseUid: decoded.uid,
    email: decoded.email,
    displayName: decoded.name,
    photoURL: decoded.picture,
  });

  res.json(new ApiResponse(200, 'Logged in successfully', user));
});
