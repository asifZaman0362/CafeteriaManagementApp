import { model, Document, Schema } from "mongoose";

interface IEntry {
  name: string;
  quantity: number;
  change: number;
}

interface IInventory extends Document {
  date: Date;
  entries: IEntry[];
}

const EntrySchema = new Schema<IEntry>({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  change: { type: Number, required: false },
});

const InventorySchema = new Schema<IInventory>({
  date: { type: Date, required: true },
  entries: { type: [EntrySchema], required: true },
});

export const Inventory = model<IInventory>("Inventory", InventorySchema);
export const InventoryItem = model<IEntry>("InventoryItem", EntrySchema);

export async function addItem(name: string, quantity: number) {
  let found = await InventoryItem.findOne({ name: name });
  if (found) {
    return await found.update({
      quantity: quantity,
      change: quantity - found.quantity,
    });
  }
  const item = new InventoryItem({
    name: name,
    quantity: quantity,
    change: quantity,
  });
  return await item.save();
}

export async function updateItem(name: string, quantity: number) {
  const item = await InventoryItem.findOne({ name: name });
  if (!item) return;
  item.name = name;
  item.change = quantity - item.quantity;
  item.quantity = quantity;
  return await item.save();
}

export async function removeItem(item_id: string) {
  const item = await InventoryItem.findById(item_id);
  return await item?.delete();
}

export async function listInventory() {
  return await InventoryItem.find();
}
