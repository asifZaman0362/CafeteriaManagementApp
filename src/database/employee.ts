import { Schema, model, Types } from "mongoose";

interface IEmployee {
  firstname: string;
  lastname: string;
  phoneNumber: string;
  emailId: string;
  address: string;
}

const EmployeeSchema = new Schema<IEmployee>({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  emailId: { type: String, required: true },
  address: { type: String, required: true },
});

export const Employee = model<IEmployee>("Employee", EmployeeSchema);

export async function getEmployeeById(id: string | Types.ObjectId) {
  return (
    (await Employee.findById(id)) || {
      name: "no name",
    }
  );
}

export async function addEmployee(
  firstname: string,
  lastname: string,
  phoneNumber: string,
  emailId: string,
  address: string
) {
  const employee = new Employee({
    firstname,
    lastname,
    phoneNumber,
    emailId,
    address,
  });
  return await employee.save();
}

export async function updateEmployee(
  id: string,
  firstname: string,
  lastname: string,
  phoneNumber: string,
  emailId: string,
  address: string
) {
  const employee = await Employee.findById(id);
  if (!employee) return;
  employee.firstname = firstname;
  employee.lastname = lastname;
  employee.phoneNumber = phoneNumber;
  employee.emailId = emailId;
  employee.address = address;
  return await employee.save();
}

export async function removeEmployee(id: string) {
  return await (await Employee.findById(id))?.delete();
}
