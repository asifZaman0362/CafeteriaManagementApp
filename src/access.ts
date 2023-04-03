import { Request, Response, Router } from "express";
import { AccessLevel } from "./database/types";
import * as database from "./database/user";

const router = Router();
export default router;

async function addUser(req: Request, res: Response) {
  const username = req.body.username;
  const password = req.body.password;
  const accessLevel = req.body.accessLevel as AccessLevel;
  const email = req.body.email;
  const result = await database.addUser(username, password, email, accessLevel);
  if (result) {
    return res.status(200);
  } else {
    return res.status(500);
  }
}

async function removeUser(req: Request, res: Response) {
  const username = req.body.username;
  const accessLevel = req.body.accessLevel;
  const result = await database.removeUser(username, accessLevel);
  if (result) {
    return res.status(200);
  } else {
    return res.status(500);
  }
}

async function updateUser(req: Request, res: Response) {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const result = await database.updateUser(username, password, email);
  if (result) {
    return res.status(200);
  } else {
    return res.status(500);
  }
}

router.post("/addUser", addUser);
router.post("/removeUser", removeUser);
router.post("/updateUser", updateUser);
