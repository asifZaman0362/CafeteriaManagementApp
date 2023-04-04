import { Router, Request, Response } from "express";
import {
  addRecord,
  updateRecord,
  removeRecord,
  getRecord,
} from "./database/attendance";

const router = Router();
export default router;

async function createAttendance(req: Request, res: Response) {
  const date = req.body.date;
  const entries = req.body.entries;
  const creationResult = await addRecord(date, entries);
  if (creationResult) {
    return res.status(200).json({ status: "Success" });
  } else return res.status(500);
}

async function listAttendance(req: Request, res: Response) {
  const date = req.body.date;
  const record = await getRecord(date);
  return res.status(200).json(record);
}

async function updateEntry(req: Request, res: Response) {
  const id = req.body.id;
  const date = req.body.date;
  const entries = req.body.entries;
  const result = await updateRecord(id, date, entries);
  if (result) {
    return res.status(200);
  } else return res.status(500);
}

async function deleteRecord(req: Request, res: Response) {
  const id = req.body.id;
  return await removeRecord(id);
}

router.post("/submit", createAttendance);
router.get("/list", listAttendance);
router.get("/update", updateEntry);
router.get("/remove", deleteRecord);
