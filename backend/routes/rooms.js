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
module.exports = router;
