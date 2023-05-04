import { Request, Response, Router } from "express";
import * as database from "./database/sales";
import { restrictToManager } from "./auth";

const router = Router();
export default router;

router.use(restrictToManager);

async function addSale(req: Request, res: Response) {
  const { date, amount } = req.body;
  const result = await database.addSale({ date: date, amount: amount });
  if (result) {
    return res.status(200).send();
  } else {
    return res.status(500).send();
  }
}

async function listSales(_req: Request, res: Response) {
  return res.status(200).json(await database.getSales());
}

async function getRecentSales(_req: Request, res: Response) {
  let data = await database.getSales();
  if (!data) return res.status(500).send();
  return data.slice(-14);
}

router.post("/addSale", addSale);
router.get("/listSales", listSales);
router.get("/getRecentSales", getRecentSales);
