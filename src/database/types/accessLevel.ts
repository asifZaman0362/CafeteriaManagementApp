import mongoose from "mongoose";

export enum AccessLevel {
    Manager,
    Cashier
}

export class AccessLevelSchemaType extends mongoose.SchemaType {
    cast(accessLevel: string) {
        if (accessLevel === "Manager") {
            return AccessLevel.Manager;
        } else if (accessLevel === "Admin") {
            return AccessLevel.Cashier;
        } else {
            throw new TypeError("Invalid enum variant! Available: Manager, Cashier");
        }
    }
}