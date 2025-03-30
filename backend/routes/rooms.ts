import express, {Request, response, Response} from "express";

const router = express.Router();
const room_model = require("../database/room_model");
import {IRoom, IRoomDetailed} from "../models/interfaces";

router.get('/', (req: Request, res: Response) => {
    room_model.getRooms()
        .then((response: IRoom[]) => res.status(200).json(response))
        .catch((error: any) => res.status(500).json({error}))
})

router.get('/:id', (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            res.status(400).json({error: "Ungültige Raum-ID"});
        }
        room_model.getRoomWithTeacherDetails(id)
            .then((room: IRoomDetailed) => res.status(200).json(room))
            .catch((error: any) => res.status(500).json(error))
    } catch (error) {
        res.status(500).json({error: "Unerwarteter Serverfehler"});
    }
})

router.post('/', (req: Request, res: Response) => {
        const room: IRoom = req.body;
        room_model.insertRoom(room)
            .then((response: IRoom) => res.status(201).json(response))
            .catch((error: any) => res.status(500).json({error}))
    }
)

router.put('/:id', (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const roomData: Omit<IRoom, 'id' | 'teacher_ids'> = req.body; // ID wird nicht aus Body genommen

        if (isNaN(id)) {
            res.status(400).json({error: "Ungültige Raum-ID"});
        }

        // Vollständiges Room-Objekt mit ID aus URL erstellen
        const roomToUpdate: IRoom = {
            ...roomData,
            id: id,
            teacher_ids: [] // oder vorhandene teacher_ids falls benötigt
        };

        room_model.updateRoom(roomToUpdate)
            .then((updatedRoom: IRoom) => res.status(200).json(updatedRoom))
            .catch((error: any) => {
                if (error.message === 'Raum nicht gefunden') {
                    res.status(404).json({error: "Raum nicht gefunden"});
                }
                res.status(500).json({error: "Serverfehler beim Aktualisieren des Raums"});
            });
    } catch (error) {
        res.status(500).json({error: "Unerwarteter Serverfehler"});
    }
});

router.delete('/assigned', (req: Request, res: Response) => {
    try {
        const room_id = parseInt(req.body.room_id);
        const teacher_id = parseInt(req.body.teacher_id);

        if (isNaN(room_id) || isNaN(teacher_id)) {
            res.status(400).json({error: "Ungültige Raum oder Teacher-ID"});
        }

        room_model.deleteAssignedRoomTeacher(room_id, teacher_id)
            .then(() => res.status(204).send())
            .catch((error: any) => {
                if (error.message === "Raum nicht gefunden") {
                    res.status(404).json({error: "Raum nicht gefunden"});
                }
                res.status(500).json({error: "Serverfehler beim Löschen des Zugewiesenen Lehrer-Raum"});
            });
    } catch (error) {
        res.status(500).json({error: "Unerwarteter Serverfehler"});
    }
});

router.delete('/:id', (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            res.status(400).json({error: "Ungültige Raum-ID"});
        }

        room_model.deleteRoom(id)
            .then(() => res.status(204).send())
            .catch((error: any) => {
                if (error.message === "Raum nicht gefunden") {
                    return res.status(404).json({error: "Raum nicht gefunden"});
                }
                res.status(500).json({error: "Serverfehler beim Löschen des Raums"});
            });
    } catch (error) {
        res.status(500).json({error: "Unerwarteter Serverfehler"});
    }
});

module.exports = router;