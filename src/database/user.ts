import { model, Schema } from "mongoose";
import { AccessLevel, AccessLevelSchemaType } from "../database/types/accessLevel";

declare module 'mongoose' {
    namespace Schema {
        namespace Types {
            class AccessLevelSchemaType extends SchemaType {}
        }
    }
}

interface IUser {
    email: string,
    username: string,
    password: string,
    accessLevel: AccessLevelSchemaType,
};

const UserSchema = new Schema<IUser> ({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    accessLevel: { type: AccessLevelSchemaType, required: true },
});

const User = model<IUser>("User", UserSchema);
export default User;