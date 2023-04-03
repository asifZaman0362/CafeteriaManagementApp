import mongoose, { model, Schema } from "mongoose";
import { AccessLevel } from "./types";

interface IUser {
  email: string;
  username: string;
  password: string;
  accessLevel: AccessLevel;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  accessLevel: { type: String, enum: AccessLevel, required: true },
});

const User = model<IUser>("User", UserSchema);
export default User;
