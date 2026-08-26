import { Schema, model } from 'mongoose';

const emailRegexp = /^[\w.+-]+@[\w-]+\.[a-zA-Z]{2,}$/;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      minlength: 2,
      maxlength: 32,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      match: emailRegexp,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      maxlength: 64,
    },
    avatarURL: {
      type: String,
      default: null,
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'violet'],
      default: 'dark',
    },
    resetToken: { type: String, default: null },
    resetTokenValidUntil: { type: Date, default: null },
  },
  { versionKey: false, timestamps: true },
);

userSchema.methods.toPublicJSON = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    avatarURL: this.avatarURL,
    theme: this.theme,
  };
};

export const UsersCollection = model('user', userSchema);
