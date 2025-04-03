"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const teacher_model = require('../database/teacher_model');
router.get('/', (req, res) => {
    teacher_model.getTeachers()
        .then((response) => res.status(200).json(response))
        .catch((error) => res.status(500).json({ error }));
});
router.get('/:id', (req, res) => {
    const teacherId = parseInt(req.params.id);
    // Validierung der ID
    if (isNaN(teacherId)) {
        res.status(400).json({ error: "Ungültige Lehrer-ID" });
    }
    teacher_model.getRoomForTeacher(teacherId)
        .then((room) => {
        if (!room) {
            res.status(404).json({ error: "Kein Raum für diesen Lehrer gefunden" });
        }
        res.status(200).json(room);
    })
        .catch((error) => res.status(500).json({ error: error.message }));
});
router.post('/', (req, res) => {
    const teacher = req.body.teacher;
    teacher_model.insertTeacher(teacher)
        .then((response) => res.status(201).json(response))
        .catch((error) => res.status(500).json({ error }));
});
router.put('/', (req, res) => {
    const teacher = req.body.teacher;
    teacher_model.modifyTeacher(teacher)
        .then((response) => res.status(201).json(response))
        .catch((error) => res.status(500).json({ error }));
});
router.post('/assignTeacherToRoom', (req, res) => {
    const { teacherId, roomId } = req.body; // teacherId und roomId aus dem Request-Body
    if (!teacherId || !roomId) {
        res.status(400).json({ error: "teacherId und roomId sind erforderlich" });
    }
    teacher_model.assignTeacherToRoom(teacherId, roomId)
        .then((assignedTeacher) => res.status(201).json(assignedTeacher)) // Gibt die Zuordnungsdaten zurück
        .catch((error) => res.status(500).json({ error: "Fehler bei der Zuordnung des Lehrers zum Raum" }));
});
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const teacherId = parseInt(req.params.id);
    // 1. Validierung der ID
    if (isNaN(teacherId)) {
        res.status(400).json({ error: "Ungültige Lehrer-ID" });
    }
    try {
        yield teacher_model.deleteTeacher(teacherId);
        res.status(204).send();
    }
    catch (error) {
        if (error.message === 'Lehrer nicht gefunden') {
            res.status(404).json({ error: error.message });
        }
        res.status(500).json({
            error: "Fehler beim Löschen des Lehrers",
            details: error.message
        });
    }
}));
module.exports = router;
