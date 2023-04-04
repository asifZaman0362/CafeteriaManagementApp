import { Request, Response, Router } from "express";
import * as database from "./database/employee";

const router = Router();
export default router;

async function addEmployee(req: Request, res: Response) {
  const { firstname, lastname, phoneNumber, emailId, address } = req.body;
  const result = await database.addEmployee(
    firstname,
    lastname,
    phoneNumber,
    emailId,
    address
  );
  if (result) {
    return res.status(200);
  } else return res.status(500);
}

async function removeEmployee(req: Request, res: Response) {
  const id = req.body.id;
  const result = await database.removeEmployee(id);
  if (result) {
    return res.status(200);
  } else return res.status(500);
}

async function updateEmployee(req: Request, res: Response) {
  const { id, firstname, lastname, phoneNumber, emailId, address } = req.body;
  const result = await database.updateEmployee(
    id,
    firstname,
    lastname,
    phoneNumber,
    emailId,
    address
  );
  if (result) {
    return res.status(200);
  } else return res.status(500);
}

router.post("/addEmployee", addEmployee);
router.post("/removeEmployee", removeEmployee);
router.post("/updateEmployee", updateEmployee);
