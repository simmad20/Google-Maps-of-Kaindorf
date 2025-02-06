"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pgDatabaseInit_1 = require("../config/pgDatabaseInit");
const getRooms = () => {
    return new Promise(function (resolve, reject) {
        pgDatabaseInit_1.pool.query(`SELECT room_id as "id", room_number, COALESCE(name, '')
                    FROM room`, (error, result) => {
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
