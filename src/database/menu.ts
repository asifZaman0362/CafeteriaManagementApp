import { model, Schema, Types } from "mongoose";

interface ICategory {
    name: string
}

const CategorySchema = new Schema<ICategory> ({
    name: { type: String, required: true }
});

interface IItem {
    name: string,
    price: number,
    category: Types.ObjectId
};

const ItemSchema = new Schema<IItem> ({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: Schema.Types.ObjectId, require: true },
});

export const Item = model<IItem>("MenuItem", ItemSchema);
export const Category = model<ICategory>("MenuCategory", CategorySchema);