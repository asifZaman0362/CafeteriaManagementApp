import { NextFunction, Request, Response, Router } from "express";

const router = Router();
export default router;

function addUser(req: Request, res: Response, next: NextFunction) {
    return res.status(200).json({status: "Success"});
}

function removeUser(req: Request, res: Response, next: NextFunction) {
    return res.status(200).json({status: "Success"});
}

function updateUser(req: Request, res: Response, next: NextFunction) {
    return res.status(200).json({status: "Success"});
}

router.post('/addUser', addUser);
router.post('/removeUser', removeUser);
router.post('/updateUser', updateUser);