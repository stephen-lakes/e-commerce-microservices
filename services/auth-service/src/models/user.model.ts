import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "../interfaces/user.interface";

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: false, select: false },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    middlename: { type: String, default: null },
    profileUrl: { type: String, default: null },
    dateOfBirth: { type: Date, default: null },
    bio: { type: String, default: null },
    providerId: { type: String, default: null },
    signInType: {
      type: String,
      required: true,
      enum: [`default`, `google`, `apple`],
      default: `default`,
    },
    role: { type: String, default: `user` },
    isActive: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

UserSchema.set("toJSON", {
  transform: (doc: Document, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    delete ret.password;
  },
});

const User = mongoose.model<IUser>(`User`, UserSchema);
export default User;
