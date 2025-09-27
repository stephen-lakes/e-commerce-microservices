import mongoose, { Schema, Document } from "mongoose";

const BlacklistedTokenSchema: Schema = new Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 }, // TTL: auto-delete after expiration
  },
});

const BlacklistedToken = mongoose.model(
  `BlacklistedToken`,
  BlacklistedTokenSchema
);
export default BlacklistedToken;
