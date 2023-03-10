import { Schema, model, connect } from "mongoose";
import { AccessLevel } from "../auth";

type Position = string;

interface IUser {
    email: string,
    username: string,
    password: string,
    accessLevel: AccessLevel,
};

interface IEmployee {
    firstname: string,
    lastname: string,
    joinDate: Date,
    phoneNumber: number,
    emailId: string,
    address: string,
    position: Position
}

const UserSchema = new Schema<IUser> ({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    accessLevel: { type: AccessLevel, required: true },
});

const EmployeeSchema = new Schema<IEmployee> {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    joinDate: { type: Date, required: true },
    phoneNumber: { type: Number, required: true },
    emailId: { type: Number, required: true },
    address: { type: String, required: true },
    position: { type: String, required: true },
}

const User = model<IUser>("User", UserSchema);

export async function setup() {
    return await connect("mongodb://127.0.0.1:27017/test");
}

export async function getPasswordHash(username: string) {
    return "";
}

export async function saveUser(username: string, password: string, accessLevel: AccessLevel) {
    let user = new 
}
