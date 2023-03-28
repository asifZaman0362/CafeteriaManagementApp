import * as argon2 from "argon2";
import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { getPasswordHash, addUser, updateUser } from "./database";
import { AccessLevel, AccessLevelSchemaType } from "./database/types/accessLevel";
import crypto from "crypto";

interface AccessToken {
    username: string,
    accessLevel: AccessLevel
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

export async function restrictToManager(req: Request, res: Response, next: NextFunction) {
    // Extract jwt, verify and get accesslevel field
    const accessLevel = getToken(req)?.accessLevel;
    if (accessLevel == AccessLevel.Manager) {
        return next();
    } else return res.status(401).json({ error: "Not a manager" });
}

export async function restrictToCashier(req: Request, res: Response, next: NextFunction) {
    // Extract jwt, verify and get accesslevel field
    const accessLevel = getToken(req)?.accessLevel;
    if (accessLevel == AccessLevel.Cashier) {
        return next();
    } else return res.status(401).json({ error: "Not a cashier" });
}

function getToken(req: Request): AccessToken | null {
    if (req.cookies['jsonwebtoken']) {
        let secret = process.env.TOKEN_SECRET as string;
        if (secret == undefined) {
            secret = crypto.randomBytes(32).toString('base64');
            process.env.TOKEN_SECRET = secret;
        }
        const token = jwt.verify(req.cookies['jsonwebtoken'], process.env.TOKEN_SECRET || '');
        return token as AccessToken;
    } else return null;
}

async function generateToken(username, usertype) {
    const user = {
        username: username,
        usertype: usertype
    };
    if (process.env.TOKEN_SECRET == undefined) {
        process.env.TOKEN_SECRET = crypto.randomBytes(32).toString('base64');
    }
    return jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: '5184000s' });
}