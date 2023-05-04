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
    return res.status(200).send();
  } else return res.status(500).send();
}

async function removeItem(req: Request, res: Response) {
  const id = req.params.id;
  const result = await database.removeItem(id);
  if (result) {
    return res.status(200).send();
  } else return res.status(500).send();
}

async function updateItem(req: Request, res: Response) {
  const { id, name, quantity } = req.body;
  const result = await database.updateItem(id, name, quantity);
  if (result) {
    return res.status(200).send();
  } else return res.status(500).send();
}

async function listInventory(_req: Request, res: Response) {
  const result = database.listInventory();
  return result ? res.status(200).json(result) : res.status(404);
}

router.post("/addItem", addItem);
router.delete("/removeItem/:id", removeItem);
router.post("/updateItem", updateItem);
router.get("/listInventory", listInventory);
