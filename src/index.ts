import express from "express";
import * as dotenv from "dotenv";
import attendace from "./attendance";
import access from "./access";
import menu from "./menu";
import ordering from "./ordering";
import inventory from "./inventory";
import authentication from "./authentcation";
import { setup } from "./database";
import bodyParser from "body-parser";
import cors from "cors";
import { authoriseRequest } from "./auth";

dotenv.config();

const app: express.Application = express();

app.use(bodyParser.json());
app.use(cors({ origin: "*" })); // TODO: change this to match only local server where frontend is running

// setup routes here
app.use("/attendace", authoriseRequest, attendace);
app.use("/access", authoriseRequest, access);
app.use("/menu", authoriseRequest, menu);
app.use("/billing", authoriseRequest, ordering);
app.use("/inventory", authoriseRequest, inventory);
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
