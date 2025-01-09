"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mapsOfKaindorf',
    password: 'postgres',
    port: 5432
});
const getRooms = () => {
    return new Promise(function (resolve, reject) {
        pool.query(`SELECT room_id as "id", room_number, COALESCE(name, '')
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
