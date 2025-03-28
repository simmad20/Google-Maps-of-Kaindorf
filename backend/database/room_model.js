"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pgDatabaseInit_1 = require("../config/pgDatabaseInit");
const getRooms = () => {
    return new Promise(function (resolve, reject) {
        pgDatabaseInit_1.pool.query(`SELECT r.room_id as "id", r.room_number, COALESCE(r.name, ''), r.x, r.y, r.width, r.height, s.teacher_id, s.valid_from
                    FROM room r LEFT JOIN school_room s USING (room_id)`, (error, result) => {
            if (error) {
                reject(error);
            }
            resolve(result.rows);
        });
    });
};
module.exports = {
    getRooms
};
