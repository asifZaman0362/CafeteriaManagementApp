import { Router, Request, Response } from "express";
import {
  addRecord,
  updateRecord,
  removeRecord,
  getRecord,
} from "./database/attendance";
import { restrictToManager } from "./auth";

const router = Router();
export default router;

router.use(restrictToManager);

async function createAttendance(req: Request, res: Response) {
  const date = req.body.date;
  const entries = req.body.entries;
  const creationResult = await addRecord(date, entries);
  if (creationResult) {
    return res.status(200).json({ status: "Success" });
  } else return res.status(500).send();
}

async function listAttendance(req: Request, res: Response) {
  try {
    const date = req.params.date;
    const record = await getRecord(new Date(date.toString()));
    return res.status(200).json(record);
  } catch (error) {
    return res.status(500).json(error);
  }
}

async function updateEntry(req: Request, res: Response) {
  const id = req.body.id;
  const date = req.body.date;
  const entries = req.body.entries;
  const result = await updateRecord(id, date, entries);
  if (result) {
    return res.status(200).send();
  } else return res.status(500).send();
}

async function deleteRecord(req: Request, res: Response) {
  const id = req.params.id;
  await removeRecord(id);
  return res.status(200).send();
}

router.post("/submit", createAttendance);
router.post("/update", updateEntry);
router.delete("/remove/:id", deleteRecord);
router.get("/getRecord/:date", listAttendance);
