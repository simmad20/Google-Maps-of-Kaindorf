import express, {Request, Response} from "express";

const router = express.Router();
const teacher_model = require('../database/teacher_model');
import {IRoomDetailed, ITeacher} from "../models/interfaces";


router.get('/', (req: Request, res: Response) => {
    teacher_model.getTeachers()
        .then((response: ITeacher[]) => res.status(200).json(response))
        .catch((error: any) => res.status(500).json({error}))
})

router.get('/:id', (req: Request, res: Response) => {
    const teacherId = parseInt(req.params.id);

    // Validierung der ID
    if (isNaN(teacherId)) {
       res.status(400).json({error: "Ungültige Lehrer-ID"});
    }

    teacher_model.getRoomForTeacher(teacherId)
        .then((room: IRoomDetailed) => {
            if (!room) {
                res.status(404).json({error: "Kein Raum für diesen Lehrer gefunden"});
            }
            res.status(200).json(room);
        })
        .catch((error: any) => res.status(500).json({error: error.message}));
});

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

router.post('/assignTeacherToRoom', (req: Request, res: Response) => {
    const {teacherId, roomId} = req.body;  // teacherId und roomId aus dem Request-Body

    if (!teacherId || !roomId) {
        res.status(400).json({error: "teacherId und roomId sind erforderlich"});
    }

    teacher_model.assignTeacherToRoom(teacherId, roomId)
        .then((assignedTeacher: any) => res.status(201).json(assignedTeacher))  // Gibt die Zuordnungsdaten zurück
        .catch((error: any) => res.status(500).json({error: "Fehler bei der Zuordnung des Lehrers zum Raum"}));
})

router.delete('/:id', async (req: Request, res: Response) => {
    const teacherId = parseInt(req.params.id);

    // 1. Validierung der ID
    if (isNaN(teacherId)) {
        res.status(400).json({error: "Ungültige Lehrer-ID"});
    }

    try {
        await teacher_model.deleteTeacher(teacherId);

        res.status(204).send();
    } catch (error: any) {
        if (error.message === 'Lehrer nicht gefunden') {
            res.status(404).json({error: error.message});
        }
        res.status(500).json({
            error: "Fehler beim Löschen des Lehrers",
            details: error.message
        });
    }
});

module.exports = router;