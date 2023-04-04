import { NextFunction, Request, Response, Router } from "express";
import * as database from "./database/inventory";

const router = Router();
export default router;

async function addItem(req: Request, res: Response) {
  const { name, quantity } = req.body;
  const result = await database.addItem(name, quantity);
  if (result) {
    return res.status(200);
  } else return res.status(500);
}

async function removeItem(req: Request, res: Response) {
  const id = req.body.id;
  const result = await database.removeItem(id);
  if (result) {
    return res.status(200);
  } else return res.status(500);
}

async function updateItem(req: Request, res: Response) {
  const { id, name, quantity } = req.body;
  const result = await database.updateItem(id, name, quantity);
  if (result) {
    return res.status(200);
  } else return res.status(500);
}

router.post("/addItem", addItem);
router.post("/removeItem", removeItem);
router.post("/updateItem", updateItem);
