import { Request, NextFunction, Response, Router } from "express";
import * as database from "./database/menu";
import { restrictToManager } from "./auth";
import multer, { diskStorage } from "multer";
import fs from "fs";

declare global {
  namespace Express {
    export interface Request {
      fileId: string;
    }
  }
}

const router = Router();
export default router;

const STATIC_LOCATION = __dirname + "../static/";

const Storage = diskStorage({
  destination: (_req: any, _file: any, cb: any) =>
    cb(null, `${STATIC_LOCATION}/thumbnails/`),
  filename: (_req: any, file: any, cb: any) => cb(null, file.fileId + ".jpg"),
});

const upload = multer({ storage: Storage });

async function addItem(req: Request, res: Response, next: NextFunction) {
  const { name, price, category_id } = req.body;
  const result = await database.addItem(name, price, category_id);
  if (result) {
    return next();
  } else return res.status(500).send();
}

async function removeItem(req: Request, res: Response) {
  const id = req.body.id;
  const result = await database.removeItem(id);
  if (result) {
    try {
      fs.rm(`thumbnails/${id}.png`, () => {
        return;
      });
    } catch (err) {
      console.error(err);
    }
    return res.status(200).send();
  } else return res.status(500).send();
}

async function updateItem(req: Request, res: Response, next: NextFunction) {
  const { id, name, price, category_id, thumbnail } = req.body;
  const result = await database.updateItem(id, name, price, category_id);
  if (result) {
    if (thumbnail) return next();
    return res.status(200).send();
  } else return res.status(500).send();
}

async function addCategory(req: Request, res: Response) {
  const name = req.body.name;
  const result = await database.addCategory(name);
  if (result) {
    return res.status(200).send();
  } else return res.status(500).send();
}

async function removeCategory(req: Request, res: Response) {
  const id = req.body.id;
  const result = await database.removeCategory(id);
  if (result) {
    return res.status(200).send();
  } else return res.status(500).send();
}

async function updateCategory(req: Request, res: Response) {
  const { id, name } = req.body;
  const result = await database.updateCategory(id, name);
  if (result) {
    return res.status(200).send();
  } else return res.status(500).send();
}

async function getItem(req: Request, res: Response) {
  const id = req.body.id;
  const result = await database.getItem(id);
  if (result) {
    return res
      .status(200)
      .json({ ...result, thumbnail: `thumbnails/${result.id}` });
  } else return res.status(404).send();
}

async function listItems(req: Request, res: Response) {
  const categories = req.body.categories;
  const found = await database.getItems(categories);
  let result = found?.map((item) => {
    return { ...item, thumbnail: `thumbnails/${item.id}` };
  });
  if (result) {
    return res.status(200).json(result);
  } else return res.status(404).send();
}

async function listCategories(_req: Request, res: Response) {
  const result = await database.listCategories();
  if (result) return res.status(200).json(result);
  else return res.status(404).send();
}

router.post(
  "/addItem",
  restrictToManager,
  addItem,
  upload.single("thumbnail"),
  (_req, res: Response) => res.status(200)
);
router.post("/removeItem", restrictToManager, removeItem);
router.post(
  "/updateItem",
  restrictToManager,
  updateItem,
  upload.single("thumbnail"),
  (_req, res: Response) => res.status(200)
);
router.post("/addCategory", restrictToManager, addCategory);
router.post("/removeCategory", restrictToManager, removeCategory);
router.post("/updateCategory", restrictToManager, updateCategory);
router.get("/getItem", getItem);
router.get("/listItems", listItems);
router.get("/listCategories", listCategories);
