import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,//обязательно
      unique: true,//уникально
    },
    passwordHash: {
      type: String,
      required: true,
    },
    avatarUrl: String, //необязательно
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('User', UserSchema);
