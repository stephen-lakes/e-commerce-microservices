import { Document, Types } from "mongoose";

export interface IUser extends Document {
  email: string;
  username: string;
  password?: string; // optional for social sign-ins
  firstname: string;
  lastname: string;
  middlename?: string | null;
  profileUrl?: string | null;
  dateOfBirth?: Date | null;
  bio?: string | null;
  // googleId?: string | null;
  // signInType: string;
  providerId?: string | null; // unique ID from provider
  signInType: `default` | `google` | `apple`;
  role: string;
  isActive: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserPayload {
  id: string;
  email: string;
  username: string;
  role: string;
}
