import * as argon2 from "argon2";
import * as jwt from "jsonwebtoken";
import { getPasswordHash } from "../database";

export enum AccessLevel {
    Manager,
    Cashier
}

export async function checkPassword(username: string, password: string): Promise<boolean> {
    try {
        let stored_hash: string = await getPasswordHash(username);
        return await argon2.verify(stored_hash, password);
    } catch (error: any) {
        console.error(error);
        return false;
    }
}

export async function addUser(username: string, password: string, accessLevel: AccessLevel): Promise<boolean> {
    try {
        
    }
}
