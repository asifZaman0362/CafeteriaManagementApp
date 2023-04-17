import { Request, Response, Router } from "express";
import * as database from "./database/order";
import { restrictToCashier } from "./auth";

const router = Router();
export default router;

router.use(restrictToCashier);

async function addOrder(req: Request, res: Response) {
  const { date, cashier, customer_name, phone, items } = req.body;
  const order = await database.createOrder(
    date,
    customer_name,
    phone,
    items,
    cashier
  );
  if (order) {
    return res.status(200).json({ id: order });
  } else return res.status(500).send();
}

async function cancelOrder(req: Request, res: Response) {
  const id = req.body.order_id;
  const result = await database.cancelOrder(id);
  if (result) {
    return res.status(200).send();
  } else return res.status(500).send();
}

async function updateOrder(req: Request, res: Response) {
  const id = req.body.order_id;
  const items = req.body.items;
  const order = await database.updateItems(id, items);
  if (order) {
    return res.status(200).json({ id: order });
  } else return res.status(500).send();
}

async function processOrder(req: Request, res: Response) {
  // interface with payment gateway here
  // for now, we manually set the order status to paid upon verifying payment manually
  const order_id = req.body.order_id;
  const result = await database.setPaid(order_id);
  if (result == database.PaymentStatus.Successfull) {
    return res.status(200).send();
  } else return res.status(500).json({ error: result });
}

async function listOrders(req: Request, res: Response) {
  const date = req.body.date;
  const result = await database.getOrders(date);
  return result ? res.status(200).json(result) : res.status(404).send();
}

async function getOrder(req: Request, res: Response) {
  const id = req.body.id;
  const result = await database.getOrder(id);
  return result ? res.status(200).json(result) : res.status(404).send();
}

router.post("/addOrder", addOrder);
router.post("/cancelOrder", cancelOrder);
router.post("/updateOrder", updateOrder);
router.post("/processOrder", processOrder);
router.get("/listOrders", listOrders);
router.get("/viewOrder", getOrder);
