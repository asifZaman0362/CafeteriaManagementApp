import mongoose, { Document, Schema, model, ObjectId, Types } from 'mongoose';

export interface Item {
    item_id: Types.ObjectId,
    quantity: number
}

interface IOrder extends Document {
    cashier_id: Types.ObjectId,
    customer_name: string,
    customer_phone: string,
    items: Item[],
    price: number,
    paid: boolean
}

const ItemSchema = new Schema<Item>({
    item_id: { 
        type: Schema.Types.ObjectId, 
        default: () => new Types.ObjectId(),
        required: true 
    },
    quantity: { type: Number, required: true }
});

const OrderSchema = new Schema<IOrder>({
    cashier_id: { type: Schema.Types.ObjectId, required: true },
    customer_name: { type: String, required: true },
    customer_phone: { type: String, required: true },
    items: { type: [ItemSchema], required: true },
    price: { type: Number, required: true },
    paid: { type: Boolean, required: true }
});

OrderSchema.pre<IOrder>('validate', function (next) {
    if (this.cashier_id && typeof this.cashier_id == 'string') {
        try {
            this.cashier_id = new Types.ObjectId(this.cashier_id);
        } catch (err) {
            next(new Error('invalid id'));
        }
    }
    next();
});

export const Order = model<IOrder>('Order', OrderSchema);