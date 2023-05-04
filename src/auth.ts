import * as argon2 from "argon2";
import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { getPasswordHash, getTokenVersion } from "./database/user";
import crypto from "crypto";
import { AccessLevel } from "./database/types";

declare global {
  namespace Express {
    export interface Request {
      accessLevel: AccessLevel;
    }
  }
}

let x = 10;

interface AccessToken {
  username: string;
  accessLevel: AccessLevel;
  id: number;
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

export async function authoriseRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = await getToken(req);
  if (!token) return res.status(401).json({ error: "failed to verify token" });
  req.accessLevel = token.accessLevel;
  return next();
}

export async function restrictToManager(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Extract jwt, verify and get accesslevel field
  const accessLevel = (await getToken(req))?.accessLevel;
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
  const accessLevel = (await getToken(req))?.accessLevel;
  if (accessLevel == AccessLevel.Cashier) {
    return next();
  } else return res.status(401).json({ error: "Not a cashier" });
}

export async function getToken(req: Request) {
  const token = req.header("Authorization");
  if (token) {
    let secret = process.env.TOKEN_SECRET as string;
    if (secret == undefined) {
      secret = crypto.randomBytes(32).toString("base64");
      process.env.TOKEN_SECRET = secret;
    }
    try {
      const verified = jwt.verify(
        token,
        process.env.TOKEN_SECRET || ""
      ) as AccessToken;
      if (
        verified.id ==
        (await getTokenVersion(verified.username, verified.accessLevel))
      ) {
        return verified;
      } else return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  } else return null;
}

export async function generateToken(username: string, usertype: AccessLevel) {
  // get token version, defaults to 0
  // if returns null, then user doesnt exist
  const tokenVersion = await getTokenVersion(username, usertype);
  if (tokenVersion != null || tokenVersion != undefined) {
    const token = {
      username: username,
      accessLevel: usertype,
      id: tokenVersion,
    };
    if (process.env.TOKEN_SECRET == undefined) {
      process.env.TOKEN_SECRET = crypto.randomBytes(32).toString("base64");
    }
    return jwt.sign(token, process.env.TOKEN_SECRET, { expiresIn: "5184000s" });
  } else return null;
}
