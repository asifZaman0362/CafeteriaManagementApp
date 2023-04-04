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

async function listEmployees(_req: Request, res: Response) {
  const employees = await database.getEmployees();
  return res.status(200).json(employees);
}

async function getEmployee(req: Request, res: Response) {
  const id = req.body.id;
  const emp = await database.getEmployeeById(id);
  if (emp) {
    return res.status(200).json(emp);
  } else return res.status(404);
}

router.post("/addEmployee", addEmployee);
router.post("/removeEmployee", removeEmployee);
router.post("/updateEmployee", updateEmployee);
router.get("/listEmployees", listEmployees);
router.get("/getEmployee", getEmployee);
