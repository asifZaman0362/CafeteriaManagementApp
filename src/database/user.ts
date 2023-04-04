import { model, Schema } from "mongoose";
import { AccessLevel } from "./types";

interface IUser {
  email: string;
  username: string;
  password: string;
  accessLevel: AccessLevel;
  token_version: number;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  accessLevel: { type: String, enum: AccessLevel, required: true },
  token_version: { type: Number, default: 0, required: true },
});

export const User = model<IUser>("User", UserSchema);

export async function getPasswordHash(
  username: string,
  accessLevel: AccessLevel
) {
  const result = await User.findOne({
    username: username,
    accessLevel: accessLevel,
  });
  return result?.password;
}

export async function getTokenVersion(
  username: string,
  accessLevel: AccessLevel
) {
  const result = await User.findOne({
    username: username,
    accessLevel: accessLevel,
  });
  return result?.token_version;
}

export async function updateTokenVersion(
  username: string,
  accessLevel: AccessLevel
) {
  const result = await User.findOne({
    username: username,
    accessLevel: accessLevel,
  });
  if (result) {
    result.token_version++;
    return await result.save();
  } else {
    return false;
  }
}

export async function addUser(
  username: string,
  password: string,
  email: string,
  accessLevel: AccessLevel
) {
  let check = await User.findOne({
    username: username,
    accessLevel: accessLevel,
  });
  if (check != null) {
    console.log("User already exists!");
    return false;
  }
  let user = new User({
    username: username,
    password: password,
    accessLevel: accessLevel,
    email: email,
  });
  console.debug(username, email, password);
  return await user.save();
}

export async function updateUser(
  username: string,
  password: string,
  email: string
) {
  let user = await User.findOne({ username: username });
  if (user != null) {
    user.email = email;
    user.password = password;
    return await user.save();
  } else {
    return false;
  }
}

export async function removeUser(username: string, accessLevel: AccessLevel) {
  const user = await User.findOne({
    username: username,
    accessLevel: accessLevel,
  });
  if (user) {
    return await user.delete();
  }
  return false;
}
