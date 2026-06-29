import adminAuth from '../config/firebase.config.js';
import * as userRepo from '../repositories/user.repository.js';
import ApiResponse from '../utils/ApiResponse.js';

export default async function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json(new ApiResponse(401, 'No authorization token provided'));
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decoded = await adminAuth.verifyIdToken(idToken);
    const user = await userRepo.findOrCreateUser({
      firebaseUid: decoded.uid,
      email: decoded.email,
      displayName: decoded.name,
      photoURL: decoded.picture,
    });

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json(new ApiResponse(401, 'Invalid or expired token'));
  }
}
