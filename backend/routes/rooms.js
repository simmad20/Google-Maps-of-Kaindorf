"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const room_model = require("../database/room_model");
router.get('/', (req, res) => {
    room_model.getRooms()
        .then((response) => res.status(200).json(response))
        .catch((error) => res.status(500).json({ error }));
});
router.get('/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: "Ungültige Raum-ID" });
        }
        room_model.getRoomWithTeacherDetails(id)
            .then((room) => res.status(200).json(room))
            .catch((error) => res.status(500).json(error));
    }
    catch (error) {
        res.status(500).json({ error: "Unerwarteter Serverfehler" });
    }
});
router.post('/', (req, res) => {
    const room = req.body;
    room_model.insertRoom(room)
        .then((response) => res.status(201).json(response))
        .catch((error) => res.status(500).json({ error }));
});
router.put('/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const roomData = req.body; // ID wird nicht aus Body genommen
        if (isNaN(id)) {
            res.status(400).json({ error: "Ungültige Raum-ID" });
        }
        // Vollständiges Room-Objekt mit ID aus URL erstellen
        const roomToUpdate = Object.assign(Object.assign({}, roomData), { id: id, teacher_ids: [] // oder vorhandene teacher_ids falls benötigt
         });
        room_model.updateRoom(roomToUpdate)
            .then((updatedRoom) => res.status(200).json(updatedRoom))
            .catch((error) => {
            if (error.message === 'Raum nicht gefunden') {
                res.status(404).json({ error: "Raum nicht gefunden" });
            }
            res.status(500).json({ error: "Serverfehler beim Aktualisieren des Raums" });
        });
    }
    catch (error) {
        res.status(500).json({ error: "Unerwarteter Serverfehler" });
    }
});
router.delete('/assigned', (req, res) => {
    try {
        const room_id = parseInt(req.body.room_id);
        const teacher_id = parseInt(req.body.teacher_id);
        if (isNaN(room_id) || isNaN(teacher_id)) {
            res.status(400).json({ error: "Ungültige Raum oder Teacher-ID" });
        }
        room_model.deleteAssignedRoomTeacher(room_id, teacher_id)
            .then(() => res.status(204).send())
            .catch((error) => {
            if (error.message === "Raum nicht gefunden") {
                res.status(404).json({ error: "Raum nicht gefunden" });
            }
            res.status(500).json({ error: "Serverfehler beim Löschen des Zugewiesenen Lehrer-Raum" });
        });
    }
    catch (error) {
        res.status(500).json({ error: "Unerwarteter Serverfehler" });
    }
});
router.delete('/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: "Ungültige Raum-ID" });
        }
        room_model.deleteRoom(id)
            .then(() => res.status(204).send())
            .catch((error) => {
            if (error.message === "Raum nicht gefunden") {
                return res.status(404).json({ error: "Raum nicht gefunden" });
            }
            res.status(500).json({ error: "Serverfehler beim Löschen des Raums" });
        });
    }
    catch (error) {
        res.status(500).json({ error: "Unerwarteter Serverfehler" });
    }
});
module.exports = router;
