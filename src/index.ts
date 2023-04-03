import express from "express";
import * as dotenv from "dotenv";
import attendace from "./attendance";
import access from "./access";
import menu from "./menu";
import billing from "./billing";
import inventory from "./inventory";
import authentication from "./authentcation";
import { setup } from "./database";
import bodyParser from "body-parser";

dotenv.config();

const app: express.Application = express();

app.use(bodyParser.json());

// setup routes here
app.use("/attendace", attendace);
app.use("/access", access);
app.use("/menu", menu);
app.use("/billing", billing);
app.use("/inventory", inventory);
app.use("/auth", authentication);

app.listen(process.env.PORT_NUMBER, async () => {
  let connection = await setup();
  if (!connection) {
    console.error("failed to connect to mongodb");
    process.exit(-1);
  } else {
    console.log("connected to mongodb!");
  }
  console.log("server started at " + process.env.PORT_NUMBER);
});
