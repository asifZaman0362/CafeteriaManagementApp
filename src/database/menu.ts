import { model, Schema, Types } from "mongoose";

interface ICategory {
  name: string;
}

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
});

interface IItem {
  name: string;
  price: number;
  category: Types.ObjectId;
}

const ItemSchema = new Schema<IItem>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: Schema.Types.ObjectId, require: true },
});

export const Item = model<IItem>("MenuItem", ItemSchema);
export const Category = model<ICategory>("MenuCategory", CategorySchema);

export async function addCategory(name: string) {
  const category = new Category();
  category.name = name;
  return await category.save();
}

export async function removeCategory(category_id: string) {
  const category = await Category.findById(category_id);
  return await category?.delete();
}

export async function updateCategory(category_id: string, name: string) {
  const category = await Category.findById(category_id);
  if (category) {
    category.name = name;
    return await category.save();
  }
}

export async function addItem(name: string, price: number, category: string) {
  const item = new Item({
    name: name,
    price: price,
    category: new Types.ObjectId(category),
  });
  if (item) {
    return await item.save();
  }
}

export async function updateItem(
  item_id: string,
  name: string,
  price: number,
  category: string
) {
  const item = await Item.findById(item_id);
  if (item) {
    item.name = name;
    item.price = price;
    item.category = new Types.ObjectId(category);
    return await item.save();
  }
}

export async function removeItem(item_id: string) {
  const item = await Item.findById(item_id);
  return await item?.delete();
}

export async function listCategories() {
  return await Category.find();
}

export async function getCategoryByName(name: string) {
  let item = await Category.findOne({ name: name });
  return item?._id.toString();
}

export async function getItem(id: string) {
  return await Item.findOne({ _id: id });
}

export async function getItems(category: string) {
  if (!category) {
    return await Item.find({});
  }
  let cat_id = new Types.ObjectId(category);
  return await Item.find({ category: cat_id });
}
