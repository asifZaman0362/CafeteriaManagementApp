import mongoose, { model, Document, Schema } from 'mongoose';

interface IEntry {
    userid: string,
    attendance: boolean
}

interface IAttendance extends Document {
    date: Date,
    entries: IEntry[]
}

const EntrySchema = new Schema<IEntry>({
    userid: { type: String, required: true },
    attendance: { type: Boolean, required: true }
});

const AttendanceSchema = new Schema<IAttendance>({
    date: { type: Date, required: true },
    entries: { type: [EntrySchema], required: true }
});

const Attendance = model<IAttendance>('Attendance', AttendanceSchema);
export default Attendance;