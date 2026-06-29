import * as userRepo from "../repositories/user.repository.js";

export const signup = async (data) => {
  return userRepo.createUser(data);
};

export const login = async (data) => {
  return userRepo.findOrCreateUser(data);
};
