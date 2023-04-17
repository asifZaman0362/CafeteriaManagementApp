import { Request, Response, Router } from "express";
import { AccessLevel } from "./database/types";
import * as database from "./database/user";
import { restrictToManager } from "./auth";

const router = Router();
export default router;

router.use(restrictToManager);

async function addUser(req: Request, res: Response) {
  const username = req.body.username;
  const password = req.body.password;
  const accessLevel = req.body.accessLevel as AccessLevel;
  const email = req.body.email;
  const result = await database.addUser(username, password, email, accessLevel);
  if (result) {
    return res.status(200).send();
  } else {
    return res.status(500).send();
  }
}

async function removeUser(req: Request, res: Response) {
  const username = req.body.username;
  const accessLevel = req.body.accessLevel;
  const result = await database.removeUser(username, accessLevel);
  if (result) {
    return res.status(200).send();
  } else {
    return res.status(500).send();
  }
}

async function updateUser(req: Request, res: Response) {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const result = await database.updateUser(username, password, email);
  if (result) {
    return res.status(200).send();
  } else {
    return res.status(500).send();
  }
}

async function getUser(req: Request, res: Response) {
  const user = await database.getUser(req.body.id);
  return user ? res.status(200).json(user) : res.status(404);
}

async function listUsers(_req: Request, res: Response) {
  const users = await database.listUsers();
  return users ? res.status(200).json(users) : res.status(404);
}

router.post("/addUser", addUser);
router.post("/removeUser", removeUser);
router.post("/updateUser", updateUser);
router.get("/listUsers", listUsers);
router.get("/viewUser", getUser);
