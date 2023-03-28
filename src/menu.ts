import { NextFunction, Request, Response, Router } from "express";

const router = Router();
export default router;

function addItem(req: Request, res: Response, next: NextFunction) {
    return res.status(200).json({status: "Success"});
}

function removeItem(req: Request, res: Response, next: NextFunction) {
    return res.status(200).json({status: "Success"});
}

function updateItem(req: Request, res: Response, next: NextFunction) {
    return res.status(200).json({status: "Success"});
}

router.post('/addItem', addItem);
router.post('/removeItem', removeItem);
router.post('/updateItem', updateItem);