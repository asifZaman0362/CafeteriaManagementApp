import { model, Document, Schema, Types } from "mongoose";
import { getEmployeeById } from "./employee";

interface IEntry {
  userid: Types.ObjectId;
  attendance: boolean;
}

interface RawEntry {
  userid: string;
  attendance: boolean;
}

interface IAttendance extends Document {
  date: Date;
  entries: IEntry[];
}

const EntrySchema = new Schema<IEntry>({
  userid: { type: Schema.Types.ObjectId, required: true },
  attendance: { type: Boolean, required: true },
});

const AttendanceSchema = new Schema<IAttendance>({
  date: { type: Date, required: true },
  entries: { type: [EntrySchema], required: true },
});

export const Attendance = model<IAttendance>("Attendance", AttendanceSchema);

export async function getRecord(date: Date) {
  const record = await Attendance.findOne({ date: date });
  interface Entry {
    name: string;
    attendance: boolean;
    userid: string;
  }
  if (record) {
    let entries: Entry[] = [];
    for (let entry of record.entries) {
      let emp = await getEmployeeById(entry.userid);
      let name = "";
      if (!emp) name = "";
      name = `${emp.firstname} ${emp.lastname}`;
      entries.push({
        name: name,
        userid: entry.userid.toString(),
        attendance: entry.attendance,
      });
    }
    return {
      date: record.date,
      entries: entries,
    };
  }
  return null;
}

export async function addRecord(date: Date, entries: RawEntry[]) {
  const attendance = new Attendance({
    date: date,
    entries: entries.map((entry) => ({
      userid: new Types.ObjectId(entry.userid),
      attendance: entry.attendance,
    })),
  });
  return (await attendance.save()) != null;
}

export async function updateRecord(
  id: string,
  date: Date,
  entries: RawEntry[]
) {
  const attendance = await Attendance.findById(id);
  if (!attendance) return false;
  attendance.date = date;
  attendance.entries = entries.map((entry) => ({
    userid: new Types.ObjectId(entry.userid),
    attendance: entry.attendance,
  }));
  return (await attendance.save()) != null;
}

export async function removeRecord(id: string) {
  const attendance = await Attendance.findById(id);
  if (!attendance) return false;
  return (await attendance.delete()) != null;
}
