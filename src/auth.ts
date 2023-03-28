import * as argon2 from "argon2";
import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { getPasswordHash, addUser, updateUser } from "./database";
import { AccessLevel, AccessLevelSchemaType } from "./database/types/accessLevel";

export async function checkPassword(username: string, password: string): Promise<boolean> {
    try {
        let stored_hash: string = await getPasswordHash(username);
        return await argon2.verify(stored_hash, password);
    } catch (error: any) {
        console.error(error);
        return false;
    }
}

export async function restrictToManager(req: Request, res: Response, next: NextFunction) {
    // Extract jwt, verify and get accesslevel field
    const accessLevel = AccessLevel.Manager;
    if (accessLevel == AccessLevel.Manager) {
        return next();
    } else return res.status(401).json({ error: "Not a manager" });
}

export async function restrictToCashier(req: Request, res: Response, next: NextFunction) {
    // Extract jwt, verify and get accesslevel field
    const accessLevel = AccessLevel.Manager;
    if (accessLevel == AccessLevel.Cashier) {
        return next();
    } else return res.status(401).json({ error: "Not a cashier" });
}