import mongoose, { Document, Schema, model, ObjectId, Types } from 'mongoose';

interface Item {
    item_id: ObjectId,
    quantity: number
}

interface IOrder extends Document {
    cashier_id: ObjectId,
    customer_name: string,
    customer_phone: string,
    items: Item[],
    price: number
}

const ItemSchema = new Schema<Item>({
    item_id: { type: Types.ObjectId, required: true },
    quantity: { type: Number, required: true }
});

const OrderSchema = new Schema<IOrder>({
    cashier_id: { type: Types.ObjectId, required: true },
    customer_name: { type: String, required: true },
    customer_phone: { type: String, required: true },
    items: { type: [ItemSchema], required: true },
    price: { type: Number, required: true }
});

const Order = model<IOrder>('Order', OrderSchema);
export default Order;