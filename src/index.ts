import * as express from "express";
import * as dotenv from "dotenv";

dotenv.config();

const app: express.Application = express();

app.get("/", (_req: express.Request, res: express.Response) => {
    res.status(200).send("hello, world!");
});

app.listen(process.env.PORT_NUMBER, () => console.log("server started at " + process.env.PORT_NUMBER));
