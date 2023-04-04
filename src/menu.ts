import { Request, Response, Router } from "express";
import * as database from "./database/menu";
import { restrictToManager, restrictToCashier } from "./auth";

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

async function getItem(req: Request, res: Response) {
  const id = req.body.id;
  const result = await database.getItem(id);
  if (result) {
    return res.status(200).json(result);
  } else return res.status(404);
}

async function listItems(req: Request, res: Response) {
  const categories = req.body.categories;
  const result = await database.getItems(categories);
  if (result) {
    return res.status(200).json(result);
  } else return res.status(404);
}

async function listCategories(_req: Request, res: Response) {
  const result = await database.listCategories();
  if (result) return res.status(200).json(result);
  else return res.status(404);
}

router.post("/addItem", restrictToManager, addItem);
router.post("/removeItem", restrictToManager, removeItem);
router.post("/updateItem", restrictToManager, updateItem);
router.post("/addCategory", restrictToManager, addCategory);
router.post("/removeCategory", restrictToManager, removeCategory);
router.post("/updateCategory", restrictToManager, updateCategory);
router.get("/getItem", getItem);
router.get("/listItems", listItems);
router.get("/listCategories", listCategories);
