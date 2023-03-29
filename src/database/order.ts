import { Document, Schema, model } from 'mongoose';

interface Item {
    item_id: string,
    quantity: number
}

interface IOrder extends Document {
    customer_name: string,
    customer_phone: string,
    items: Item[],
    price: number
}

const ItemSchema = new Schema<Item>({
    item_id: { type: String, required: true },
    quantity: { type: Number, required: true }
});

const OrderSchema = new Schema<IOrder>({
    customer_name: { type: String, required: true },
    customer_phone: { type: String, required: true },
    items: { type: [ItemSchema], required: true },
    price: { type: Number, required: true }
});

const Order = model<IOrder>('Order', OrderSchema);
export default Order;