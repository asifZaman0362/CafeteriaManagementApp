import { Schema, model, connect } from "mongoose";
import { AccessLevel, AccessLevelSchemaType } from "../database/types/accessLevel";
import User from "./user";


export async function setup() {
    return await connect("mongodb://127.0.0.1:27017/test");
}

export async function getPasswordHash(username: string) {
    return "";
}

export async function addUser(username: string, password: string, email: string, accessLevel: AccessLevel) {
    let check = User.findOne({username: username});
    if (check != null) {
        return false;
    }
    let user = new User({
        username: username,
        password: password,
        accessLevel: accessLevel,
        email: email
    });
    return await user.save();
}

export async function updateUser(username: string, password: string, email: string) {
    let user = await User.findOne({ username: username });
    if (user != null) {
        user.email = email;
        user.password = password;
        return await user.save();
    } else {
        return false;
    }
}
