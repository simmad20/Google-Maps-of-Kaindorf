import express, {Request, Response} from "express";

const router = express.Router();
const room_model = require("../database/room_model");
import {IRoom} from "../models/interfaces";

router.get('/', (req: Request, res: Response) => {
    room_model.getRooms()
        .then((response: IRoom[]) => res.status(200).json(response))
        .catch((error: any) => res.status(500).json({error}))
})

module.exports = router;