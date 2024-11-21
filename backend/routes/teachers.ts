import express, {Request, Response} from "express";

const router = express.Router();
const teacher_model = require('../database/teacher_model');
import {ITeacher} from "../models/interfaces";

router.get('/', (req: Request, res: Response) => {
    teacher_model.getTeachers()
        .then((response: ITeacher[]) => res.status(200).json(response))
        .catch((error: any) => res.status(500).json({error}))
})

router.post('/', (req: Request, res: Response) => {
    const teacher: ITeacher = req.body.teacher;
    teacher_model.insertTeacher(teacher)
        .then((response: string) => res.status(201).json(response))
        .catch((error: any) => res.status(500).json({error}))
})

router.put('/', (req: Request, res: Response) => {
    const teacher: ITeacher = req.body.teacher;
    teacher_model.modifyTeacher(teacher)
        .then((response: string) => res.status(201).json(response))
        .catch((error: any) => res.status(500).json({error}))
})

module.exports = router;