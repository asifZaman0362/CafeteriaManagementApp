import * as argon2 from "argon2";
import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import {
  getPasswordHash,
  getTokenVersion,
  addUser,
  updateUser,
} from "./database";
import crypto from "crypto";
import { AccessLevel } from "./database/types";

interface AccessToken {
  username: string;
  accessLevel: AccessLevel;
}

export async function getHash(password: string): Promise<string> {
  return await argon2.hash(password);
}

export async function checkPassword(
  username: string,
  password: string,
  accessLevel: AccessLevel
): Promise<boolean> {
  try {
    let stored_hash: string | undefined = await getPasswordHash(
      username,
      accessLevel
    );
    if (stored_hash) {
      return await argon2.verify(stored_hash, password);
    } else return false;
  } catch (error: any) {
    console.error(error);
    return false;
  }
}

export async function restrictToManager(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Extract jwt, verify and get accesslevel field
  const accessLevel = getToken(req)?.accessLevel;
  if (accessLevel == AccessLevel.Manager) {
    return next();
  } else return res.status(401).json({ error: "Not a manager" });
}

export async function restrictToCashier(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Extract jwt, verify and get accesslevel field
  const accessLevel = getToken(req)?.accessLevel;
  if (accessLevel == AccessLevel.Cashier) {
    return next();
  } else return res.status(401).json({ error: "Not a cashier" });
}

export function getToken(req: Request): AccessToken | null {
  if (req.cookies["jsonwebtoken"]) {
    let secret = process.env.TOKEN_SECRET as string;
    if (secret == undefined) {
      secret = crypto.randomBytes(32).toString("base64");
      process.env.TOKEN_SECRET = secret;
    }
    const token = jwt.verify(
      req.cookies["jsonwebtoken"],
      process.env.TOKEN_SECRET || ""
    );
    return token as AccessToken;
  } else return null;
}

export async function generateToken(username: string, usertype: AccessLevel) {
  const tokenVersion = await getTokenVersion(username, usertype);
  if (tokenVersion) {
    const token = { username: username, usertype: usertype, id: tokenVersion };
    if (process.env.TOKEN_SECRET == undefined) {
      process.env.TOKEN_SECRET = crypto.randomBytes(32).toString("base64");
    }
    return jwt.sign(token, process.env.TOKEN_SECRET, { expiresIn: "5184000s" });
  } else return null;
}
