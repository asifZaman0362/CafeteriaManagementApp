import { Schema, model, connect, Types } from "mongoose";
import { AccessLevel } from "./types";
import { Order, Item as SchemaItem } from "./order";

interface Item {
  item_id: string;
  quantity: number;
}

export async function setup() {
  return await connect("mongodb://127.0.0.1:27017/test");
}
