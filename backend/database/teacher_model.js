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
const getTeachers = () => {
    return new Promise(function (resolve, reject) {
        pool.query('SELECT teacher_id as "id", firstname, lastname, title, abbreviation, image_url FROM person INNER JOIN teacher ON person_id = teacher_id', (error, result) => {
            if (error) {
                reject(error);
            }
            resolve(result.rows);
        });
    });
};
module.exports = {
    getTeachers
};
