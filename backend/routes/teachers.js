"use strict";
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
module.exports = router;
