import * as express from "express";
import { Router, Request, Response, NextFunction } from "express";

const router = Router();
export default router;

function createAttendance(req: Request, res: Response) {
  return res.status(200).json({ status: "Success" });
}

function listAttendance(req: Request, res: Response) {
  return res.status(200).json({});
}

function updateEntry(req: Request, res: Response) {
  return res.status(200).json({ status: "Success" });
}

router.post("/submit", createAttendance);
router.get("/list", listAttendance);
router.get("/update", updateEntry);
