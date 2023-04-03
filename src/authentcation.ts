import { Router } from "express";
import { Request, Response } from "express";
import { checkPassword } from "./auth";
import { AccessLevel } from "./database/types/accessLevel";

const router = Router();
export default router;

router.post("/login", async (req: Request, res: Response) => {
  const username = req.body.username;
  const password = req.body.password;
  const accessLevel = req.body.accessLevel as AccessLevel;
  let result = await checkPassword(username, password, accessLevel);
  if (result) {
    return res.status(200).json({
      token: {
        username: username,
        accessLevel: accessLevel,
      },
    });
  } else
    return res
      .status(401)
      .send("No matching username or password for the provided access type!");
});
