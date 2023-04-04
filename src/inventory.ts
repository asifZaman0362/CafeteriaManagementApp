import { Request, Response, Router } from "express";
import * as database from "./database/inventory";
import { restrictToManager } from "./auth";

const router = Router();
export default router;

router.use(restrictToManager);

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

async function listInventory(_req: Request, res: Response) {
  const result = database.listInventory();
  return result ? res.status(200).json(result) : res.status(404);
}

router.post("/addItem", addItem);
router.post("/removeItem", removeItem);
router.post("/updateItem", updateItem);
router.get("/listInventory", listInventory);
