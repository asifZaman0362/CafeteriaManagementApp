import { Schema, model, connect, Types } from "mongoose";
import { AccessLevel } from "./types";
import { Order, Item as SchemaItem } from "./order";
import User from "./user";

interface Item {
  item_id: string;
  quantity: number;
}

export async function setup() {
  return await connect("mongodb://127.0.0.1:27017/test");
}

export async function getPasswordHash(
  username: string,
  accessLevel: AccessLevel
) {
  const result = await User.findOne({
    username: username,
    accessLevel: accessLevel,
  });
  return result?.password;
}

export async function getTokenVersion(
  username: string,
  accessLevel: AccessLevel
) {
  const result = await User.findOne({
    username: username,
    accessLevel: accessLevel,
  });
  return result?.token_version;
}

export async function updateTokenVersion(
  username: string,
  accessLevel: AccessLevel
) {
  const result = await User.findOne({
    username: username,
    accessLevel: accessLevel,
  });
  if (result) {
    result.token_version++;
    return await result.save();
  } else {
    return false;
  }
}

export async function addUser(
  username: string,
  password: string,
  email: string,
  accessLevel: AccessLevel
) {
  let check = await User.findOne({
    username: username,
    accessLevel: accessLevel,
  });
  if (check != null) {
    console.log("User already exists!");
    return false;
  }
  let user = new User({
    username: username,
    password: password,
    accessLevel: accessLevel,
    email: email,
  });
  console.debug(username, email, password);
  return await user.save();
}

export async function updateUser(
  username: string,
  password: string,
  email: string
) {
  let user = await User.findOne({ username: username });
  if (user != null) {
    user.email = email;
    user.password = password;
    return await user.save();
  } else {
    return false;
  }
}

export async function removeUser(username: string, accessLevel: AccessLevel) {
  const user = await User.findOne({
    username: username,
    accessLevel: accessLevel,
  });
  if (user) {
    return await user.delete();
  }
  return false;
}

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

export async function addItems(order_id: string, items: Item[]) {
  const order = await Order.findById(order_id);
  if (!order) return null;
  else if (order.paid) return null;
  else {
    const newItems = items.map((item) => ({
      ...item,
      item_id: new Types.ObjectId(item.item_id),
    }));
    order.items.push(...newItems);
    return order.save();
  }
}

export async function updateItems(order_id: string, items: Item[]) {
  const order = await Order.findById(order_id);
  if (!order) return false;
  else if (order.paid) return null;
  else {
    order.items = items.map((item) => ({
      ...item,
      item_id: new Types.ObjectId(item.item_id),
    }));
    return await order.save();
  }
}
