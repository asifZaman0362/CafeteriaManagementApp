import { Schema, model } from "mongoose";

interface IEmployee {
    firstname: string,
    lastname: string,
    phoneNumber: number,
    emailId: string,
    address: string,
}

const EmployeeSchema = new Schema<IEmployee>({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
    emailId: { type: String, required: true },
    address: { type: String, required: true },
});

const Employee = model<IEmployee>('Employee', EmployeeSchema);
export default Employee;