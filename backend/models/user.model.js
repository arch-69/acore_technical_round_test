import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    unique:true
  },
  displayName: {
    type: String
  },
  photoURL: {
    type: String
  },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
