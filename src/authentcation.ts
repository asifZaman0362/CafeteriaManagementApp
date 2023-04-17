import { Router } from "express";
import { Request, Response } from "express";
import {
  authoriseRequest,
  checkPassword,
  getToken,
  generateToken,
} from "./auth";
import { registerUser, updateTokenVersion } from "./database/user";
import { AccessLevel } from "./database/types";

const router = Router();
export default router;

router.post("/login", login);
router.post("/register", register);
router.get("/logout", logout);
router.get("/validateToken", authoriseRequest, validateToken);

async function validateToken(req: Request, res: Response) {
  return res.status(200).send();
}

async function login(req: Request, res: Response) {
  console.log("attempting login!");
  let { username, password, accessLevel } = req.body;
  if (await checkPassword(username, password, accessLevel as AccessLevel)) {
    let tk = await generateToken(username, accessLevel as AccessLevel);
    return res.status(200).json({ token: tk });
  } else return res.status(401).send();
}

async function register(req: Request, res: Response) {
  let { username, password, email } = req.body;
  let registration = await registerUser(username, password, email);
  if (registration != false) {
    return res
      .status(200)
      .json({ token: generateToken(username, AccessLevel.Manager) });
  }
}

async function logout(req: Request, res: Response) {
  const token = await getToken(req);
  if (token) {
    const result = await updateTokenVersion(token.username, token.accessLevel);
    if (result) {
      res.status(200).send("Logged out!");
    }
  }
}
