import User from '../models/user.model.js';

export async function findByFirebaseUid(uid) {
  return User.findOne({ firebaseUid: uid });
}

export async function findById(id) {
  return User.findById(id);
}

export async function createUser(data) {
  return User.create(data);
}

export async function findOrCreateUser(data) {
  let user = await findByFirebaseUid(data.firebaseUid);
  if (!user) {
    user = await createUser(data);
  }
  return user;
}
