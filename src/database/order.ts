import { Document, Schema, model, Types } from "mongoose";

export interface Item {
  item_id: Types.ObjectId;
  quantity: number;
}

export interface RawItem {
  item_id: string;
  quantity: number;
}

export enum PaymentStatus {
  Successfull = "Successfull",
  Failed = "Failed",
  AlreadyPaid = "AlreadyPaid",
  OrderDoesntExist = "OrderDoesntExist",
  InternalError = "InternalError",
}

interface IOrder extends Document {
  cashier_id: Types.ObjectId;
  customer_name: string;
  customer_phone: string;
  items: Item[];
  price: number;
  paid: boolean;
}

const ItemSchema = new Schema<Item>({
  item_id: {
    type: Schema.Types.ObjectId,
    default: () => new Types.ObjectId(),
    required: true,
  },
  quantity: { type: Number, required: true },
});

const OrderSchema = new Schema<IOrder>({
  cashier_id: { type: Schema.Types.ObjectId, required: true },
  customer_name: { type: String, required: true },
  customer_phone: { type: String, required: true },
  items: { type: [ItemSchema], required: true },
  price: { type: Number, required: true },
  paid: { type: Boolean, required: true },
});

OrderSchema.pre<IOrder>("validate", function (next) {
  if (this.cashier_id && typeof this.cashier_id == "string") {
    try {
      this.cashier_id = new Types.ObjectId(this.cashier_id);
    } catch (err) {
      next(new Error("invalid id"));
    }
  }
  next();
});

export const Order = model<IOrder>("Order", OrderSchema);

export async function createOrder(
  customer: string,
  phone: string,
  items: Item[],
  cashier: string
) {
  const order = new Order({
    customer_name: customer,
    customer_phone: phone,
    items: items,
    cashier_id: cashier,
  });
  return await (
    await order.save()
  ).id;
}

export async function cancelOrder(order_id: string) {
  const order = await Order.findById(order_id);
  if (!order) return null;
  else if (order.paid) return null;
  else return await order.delete();
}

export async function addItems(order_id: string, items: RawItem[]) {
  const order = await Order.findById(order_id);
  if (!order) return null;
  else if (order.paid) return null;
  else {
    const newItems = items.map((item) => ({
      item_id: new Types.ObjectId(item.item_id),
      quantity: item.quantity,
    }));
    order.items.push(...newItems);
    return order.save();
  }
}

export async function updateItems(order_id: string, items: RawItem[]) {
  const order = await Order.findById(order_id);
  if (!order) return false;
  else if (order.paid) return null;
  else {
    order.items = items.map((item) => ({
      item_id: new Types.ObjectId(item.item_id),
      quantity: item.quantity,
    }));
    return await order.save();
  }
}

export async function setPaid(order_id: string): Promise<PaymentStatus> {
  const order = await Order.findById(order_id);
  if (!order) return PaymentStatus.OrderDoesntExist;
  else if (order.paid) return PaymentStatus.AlreadyPaid;
  order.paid = true;
  if (await order.save()) return PaymentStatus.Successfull;
  else return PaymentStatus.InternalError;
}
