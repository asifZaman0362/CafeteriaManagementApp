import { Schema, model, connect } from "mongoose";
import { AccessLevel, AccessLevelSchemaType } from "../database/types/accessLevel";

declare module 'mongoose' {
    namespace Schema {
        namespace Types {
            class AccessLevelSchemaType extends SchemaType {}
        }
    }
}

type Position = string;

export interface IUser {
    email: string,
    username: string,
    password: string,
    accessLevel: AccessLevelSchemaType,
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
    accessLevel: { type: AccessLevelSchemaType, required: true },
});

const EmployeeSchema = new Schema<IEmployee>({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    joinDate: { type: Date, required: true },
    phoneNumber: { type: Number, required: true },
    emailId: { type: String, required: true },
    address: { type: String, required: true },
    position: { type: String, required: true },
});

const User = model<IUser>("User", UserSchema);

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
