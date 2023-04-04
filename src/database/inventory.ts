import { model, Document, Schema } from "mongoose";
import { Item } from "./menu";

interface IEntry {
  name: string;
  quantity: number;
}

interface IInventory extends Document {
  date: Date;
  entries: IEntry[];
}

const EntrySchema = new Schema<IEntry>({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
});

const InventorySchema = new Schema<IInventory>({
  date: { type: Date, required: true },
  entries: { type: [EntrySchema], required: true },
});

export const Inventory = model<IInventory>("Inventory", InventorySchema);
export const InventoryItem = model<IEntry>("InventoryItem", EntrySchema);

export async function addItem(name: string, quantity: number) {
  const item = new Item({
    name: name,
    quantity: quantity,
  });
  return await item.save();
}

export async function updateItem(
  item_id: string,
  name: string,
  quantity: number
) {
  const item = await InventoryItem.findById(item_id);
  if (!item) return;
  item.name = name;
  item.quantity = quantity;
  return await item.save();
}

export async function removeItem(item_id: string) {
  const item = await InventoryItem.findById(item_id);
  return await item?.delete();
}

export async function listInventory() {
  return await Item.find();
}
