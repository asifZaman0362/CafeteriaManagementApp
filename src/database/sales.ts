import { Document, Schema, model, Types } from "mongoose";

export interface Sale {
  date: string;
  amount: number;
}

interface ISalesRecord extends Document {
  date: string;
  order_count: number;
  sales: number;
}

const SalesRecordSchema = new Schema<ISalesRecord>({
  date: { type: String, required: true },
  order_count: { type: Number, required: true }.type,
  sales: { type: Number, required: true },
});

export const SalesRecord = model<ISalesRecord>(
  "SalesRecord",
  SalesRecordSchema
);

export async function addSale(sale: Sale) {
  try {
    let salesRecord = await SalesRecord.findOne({ date: sale.date });
    if (!salesRecord) {
      return await new SalesRecord({
        date: sale.date,
        order_count: 1,
        sales: sale.amount,
      }).save();
    }
    return await salesRecord?.update({
      order_count: salesRecord?.order_count + 1,
      sales: salesRecord?.sales + sale.amount,
    });
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getSales() {
  try {
    return await SalesRecord.find();
  } catch (err) {
    console.error(err);
  }
}
