import { Request, Response, Router } from "express";
import * as database from "./database/menu";

const router = Router();
export default router;

async function addItem(req: Request, res: Response) {
  const { name, price, category_id } = req.body;
  const result = await database.addItem(name, price, category_id);
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
  const { id, name, price, category_id } = req.body;
  const result = await database.updateItem(id, name, price, category_id);
  if (result) {
    return res.status(200);
  } else return res.status(500);
}

async function addCategory(req: Request, res: Response) {
  const name = req.body.name;
  const result = await database.addCategory(name);
  if (result) {
    return res.status(200);
  } else return res.status(500);
}

async function removeCategory(req: Request, res: Response) {
  const id = req.body.id;
  const result = await database.removeCategory(id);
  if (result) {
    return res.status(200);
  } else return res.status(500);
}

async function updateCategory(req: Request, res: Response) {
  const { id, name } = req.body;
  const result = await database.updateCategory(id, name);
  if (result) {
    return res.status(200);
  } else return res.status(500);
}

router.post("/addItem", addItem);
router.post("/removeItem", removeItem);
router.post("/updateItem", updateItem);
router.post("/addCategory", addCategory);
router.post("/removeCategory", removeCategory);
router.post("/updateCategory", updateCategory);
