import express, {Request, Response} from "express";

const router = express.Router();
const feedback_model = require('../database/feedback_model');
import {IFeedback} from "../models/interfaces";

router.get('/', (req: Request, res: Response) => {
    feedback_model.getFeedback()
        .then((response: IFeedback[]) => res.status(200).json(response))
        .catch((error: any) => res.status(500).json({error}))
})

router.post('/', (req: Request, res: Response) => {
    const feedback: IFeedback = req.body.feedback;
    feedback_model.insertFeedback(feedback)
        .then((response: string) => res.status(201).json(response))
        .catch((error: any) => res.status(500).json({error}))
})

router.put('/', (req: Request, res: Response) => {
    const feedback: IFeedback = req.body.feedback;
    feedback_model.modifyFeedback(feedback)
        .then((response: string) => res.status(201).json(response))
        .catch((error: any) => res.status(500).json({error}))
})

module.exports = router;