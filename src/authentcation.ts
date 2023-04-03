import { Router } from "express";
import { Request, Response } from "express";
import { checkPassword, getHash, getToken } from "./auth";
import { addUser, updateTokenVersion } from "./database";
import { AccessLevel } from "./database/types";

const router = Router();
export default router;

router.post("/login", login);
router.post("/register", register);
router.get("/logout", logout);

async function login(req: Request, res: Response) {
  const username = req.body.username;
  const password = req.body.password;
  const accessLevel = req.body.accessLevel as AccessLevel;
  let result = await checkPassword(username, password, accessLevel);
  if (result) {
    return res.status(200).json({
      token: {
        username: username,
        accessLevel: accessLevel,
      },
    });
  } else
    return res
      .status(401)
      .send("No matching username or password for the provided access type!");
}

async function register(req: Request, res: Response) {
  const username = req.body.username;
  const password = await getHash(req.body.password);
  const email = req.body.email;
  const accessLevel = AccessLevel.Manager;
  let result = await addUser(username, password, email, accessLevel);
  if (result) return res.status(200).send("Added!");
  else return res.status(400).send("Failed to add user!");
}

async function logout(req: Request, res: Response) {
  const token = getToken(req);
  if (token) {
    const result = await updateTokenVersion(token.username, token.accessLevel);
    if (result) {
      res.status(200).send("Logged out!");
    }
  }
}
