import mongoose, { model, Document, Schema } from 'mongoose';

interface IEntry {
    name: string,
    quantity: number
}

interface IInventory extends Document {
    date: Date,
    entries: IEntry[]
}

const EntrySchema = new Schema<IEntry>({
    name: { type: String, required: true },
    quantity: { type: Number, required: true }
});

const InventorySchema = new Schema<IInventory>({
    date: { type: Date, required: true },
    entries: { type: [EntrySchema], required: true }
});

export const Inventory = model<IInventory>("Inventory", InventorySchema);
export const InventoryItem = model<IEntry>("InventoryItem", EntrySchema);