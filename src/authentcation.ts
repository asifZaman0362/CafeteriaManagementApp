import { Router } from "express";
import { Request, Response } from "express";
import { checkPassword } from "./auth";
import { addUser } from "./database";
import { AccessLevel } from "./database/types";

const router = Router();
export default router;

router.post("/login", login);

router.post("/register", register);

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
  const password = req.body.password;
  const email = req.body.email;
  const accessLevel = AccessLevel.Manager;
  let result = await addUser(username, password, email, accessLevel);
  if (result) return res.status(200).send("Added!");
  else return res.status(400).send("Failed to add user!");
}
