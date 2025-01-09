"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const feedback_model = require('../database/feedback_model');
router.get('/', (req, res) => {
    feedback_model.getFeedback()
        .then((response) => res.status(200).json(response))
        .catch((error) => res.status(500).json({ error }));
});
router.post('/', (req, res) => {
    const feedback = req.body.feedback;
    feedback_model.insertFeedback(feedback)
        .then((response) => res.status(201).json(response))
        .catch((error) => res.status(500).json({ error }));
});
router.put('/', (req, res) => {
    const feedback = req.body.feedback;
    feedback_model.modifyFeedback(feedback)
        .then((response) => res.status(201).json(response))
        .catch((error) => res.status(500).json({ error }));
});
module.exports = router;
