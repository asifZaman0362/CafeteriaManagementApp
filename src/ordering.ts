import { NextFunction, Request, Response, Router } from "express";

const router = Router();
export default router;

function addOrder(req: Request, res: Response, next: NextFunction) {
    return res.status(200).json({status: "Success"});
}

function cancelOrder(req: Request, res: Response, next: NextFunction) {
    return res.status(200).json({status: "Success"});
}

function updateOrder(req: Request, res: Response, next: NextFunction) {
    return res.status(200).json({status: "Success"});
}

router.post('/addOrder', addOrder);
router.post('/cancelOrder', cancelOrder);
router.post('/updateOrder', updateOrder);