import * as express from "express";
import * as dotenv from "dotenv";

dotenv.config();

const app: express.Application = express();

// setup routes here


app.listen(process.env.PORT_NUMBER, () => console.log("server started at " + process.env.PORT_NUMBER));
