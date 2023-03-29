import express from "express";
import * as dotenv from "dotenv";
import attendace from "./attendance";
import access from "./access";
import menu from "./menu";
import billing from "./billing";
import inventory from "./inventory";

dotenv.config();

const app: express.Application = express();

// setup routes here
app.use('/attendace', attendace);
app.use('/access', access);
app.use('/menu', menu);
app.use('/billing', billing);
app.use('/inventory', inventory);

app.listen(process.env.PORT_NUMBER, () => console.log("server started at " + process.env.PORT_NUMBER));
