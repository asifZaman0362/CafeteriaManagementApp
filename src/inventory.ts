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
  const { name, quantity } = req.body;
  console.debug(name, quantity);
  const result = await database.updateItem(name, quantity);
  if (result) {
    return res.status(200).send();
  } else return res.status(500).send();
}

async function listInventory(_req: Request, res: Response) {
  const result = await database.listInventory();
  res.status(200).json(result);
}

router.post("/addItem", addItem);
router.delete("/removeItem/:id", removeItem);
router.post("/updateItem", updateItem);
router.get("/listInventory", listInventory);
