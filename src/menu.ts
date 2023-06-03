import { Request, NextFunction, Response, Router } from "express";
import * as database from "./database/menu";
import { restrictToManager } from "./auth";
import multer, { diskStorage } from "multer";
import fs from "fs";
import crypto from "crypto";

declare global {
  namespace Express {
    export interface Request {
      fileId: string;
    }
  }
}

const router = Router();
export default router;

const storage = multer.diskStorage({
  destination: (_req: any, _file: any, cb: any) => {
    cb(null, "static/thumbnails");
  },
  filename: (req: any, _file: any, cb: any) => {
    let filename = crypto.randomUUID();
    req.fileId = filename;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

async function addItem(req: Request, res: Response, next: NextFunction) {
  const { name, price, category } = req.body;
  let filename = req.fileId;
  const category_id = await database.getCategoryByName(category);
  if (!category_id) {
    return res.status(500).send("could not find category");
  }
  const result = await database.addItem(name, price, category_id);
  if (result) {
    let id = result.id;
    fs.rename(
      `static/thumbnails/${filename}`,
      `static/thumbnails/${id}.jpg`,
      (err) => {
        console.error(err);
      }
    );
    return next();
  } else return res.status(500).send();
}

async function removeItem(req: Request, res: Response) {
  const id = req.params.id;
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
    console.log("added");
    return res.status(200).json({ id: result.id });
  } else return res.status(500).send();
}

async function removeCategory(req: Request, res: Response) {
  const id = req.params.id;
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
  const id = req.query.id;
  if (!id) return res.send(400).send();
  const result = await database.getItem(id.toString());
  if (result) {
    return res.status(200).json({
      name: result.name,
      price: result.price,
      id: result.id,
      thumbnail: `/thumbnails/${result.id}.jpg`,
    });
  } else return res.status(404).send();
}

async function listItems(req: Request, res: Response) {
  let category = req.query.category?.toString();
  console.log(category);
  if (!category || category == "null") category = "";
  const found = await database.getItems(category);
  let result = found?.map((item) => {
    return {
      name: item.name,
      price: item.price,
      id: item.id,
      thumbnail: `/thumbnails/${item.id}.jpg`,
    };
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
  upload.single("thumbnail"),
  addItem,
  (_req, res: Response) => res.status(200)
);
router.delete("/removeItem/:id", restrictToManager, removeItem);
router.post(
  "/updateItem",
  restrictToManager,
  upload.single("thumbnail"),
  updateItem,
  (_req, res: Response) => res.status(200)
);
router.post("/addCategory", restrictToManager, addCategory);
router.delete("/removeCategory/:id", restrictToManager, removeCategory);
router.post("/updateCategory", restrictToManager, updateCategory);
router.get("/getItem", getItem);
router.get("/listItems", listItems);
router.get("/listCategories", listCategories);
