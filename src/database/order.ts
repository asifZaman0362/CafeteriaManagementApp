import { Document, Schema, model, Types } from "mongoose";
import * as sales from "./sales";
import { getItem } from "./menu";

export interface Item {
  item_id: Types.ObjectId;
  quantity: number;
}

export interface RawItem {
  id: string;
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
  date: Date;
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
  date: { type: Date, required: true },
  customer_name: { type: String, required: true },
  customer_phone: { type: String, required: true },
  items: { type: [ItemSchema], required: true },
  price: { type: Number, required: false },
  paid: { type: Boolean, default: false, required: true },
});

export const Order = model<IOrder>("Order", OrderSchema);

export async function createOrder(
  date: Date,
  customer: string,
  phone: string,
  items: Item[]
) {
  const order = new Order({
    date: date,
    customer_name: customer,
    customer_phone: phone,
    items: items,
  });
  return await (
    await order.save()
  ).id;
}

export async function cancelOrder(order_id: string) {
  try {
    console.log("id: ", order_id);
    const order = await Order.findOne({
      _id: Types.ObjectId.createFromHexString(order_id) as Types.ObjectId,
    });
    if (!order) return null;
    else {
      console.log("deleting...");
      return await Order.deleteOne({
        _id: Types.ObjectId.createFromHexString(order_id) as Types.ObjectId,
      });
    }
  } catch (error) {
    console.error(error);
  }
}

export async function addItems(order_id: string, items: RawItem[]) {
  try {
    const order = await Order.findById(order_id);
    if (!order) return null;
    else if (order.paid) return null;
    else {
      const newItems = items.map((item) => ({
        item_id: Types.ObjectId.createFromHexString(item.id) as Types.ObjectId,
        quantity: item.quantity,
      }));
      order.items.push(...newItems);
      return order.save();
    }
  } catch (error) {
    console.error(error);
  }
}

export async function updateItems(order_id: string, items: RawItem[]) {
  try {
    const order = await Order.findById(order_id);
    if (!order) return false;
    else if (order.paid) return null;
    else {
      console.debug(items);
      order.items = items.map((item) => ({
        item_id: Types.ObjectId.createFromHexString(item.id) as Types.ObjectId,
        quantity: item.quantity,
      }));
      return await order.save();
    }
  } catch (error) {
    console.error(error);
  }
}

export async function setPaid(order_id: string): Promise<PaymentStatus> {
  console.log("wtd");
  try {
    const order = await Order.findById(order_id);
    if (!order) return PaymentStatus.OrderDoesntExist;
    else if (order.paid) return PaymentStatus.AlreadyPaid;
    order.paid = true;
    let price = 0;
    for (let item of order.items) {
      let _item = await getItem(item.item_id.toString());
      if (_item) price += _item.price * item.quantity;
    }
    order.price = price;
    if (await order.save()) {
      sales.addSale({ date: order.date.toDateString(), amount: price });
      return PaymentStatus.Successfull;
    } else return PaymentStatus.InternalError;
  } catch (error) {
    console.error(error);
    return PaymentStatus.OrderDoesntExist;
  }
}

export async function getOrder(order_id: string) {
  try {
    return await Order.findById(new Types.ObjectId(order_id));
  } catch (error) {
    console.error(error);
  }
}

export async function getOrders(date: Date | undefined) {
  if (date) {
    return await Order.find({ date: Date });
  }
  return await Order.find({});
}
