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
        pool.query(`SELECT teacher_id as "id", firstname, lastname, title, abbreviation, image_url
                    FROM person
                             INNER JOIN teacher ON person_id = teacher_id`, (error, result) => {
            if (error) {
                reject(error);
            }
            resolve(result.rows);
        });
    });
};
const insertTeacher = (teacher) => {
    console.log(teacher);
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const client = yield pool.connect();
        try {
            yield client.query('BEGIN');
            const personInsertQuery = `
                INSERT INTO person (firstname, lastname)
                VALUES ($1, $2) RETURNING person_id as "id"
            `;
            const personValues = [
                teacher.firstname,
                teacher.lastname
            ];
            const personResult = yield client.query(personInsertQuery, personValues);
            const personId = personResult.rows[0].id;
            const teacherInsertQuery = `
                INSERT INTO teacher (teacher_id, abbreviation, image_url, title)
                VALUES ($1, $2, $3, $4)
            `;
            const teacherValues = [
                personId,
                teacher.abbreviation,
                teacher.image_url,
                teacher.title
            ];
            yield client.query(teacherInsertQuery, teacherValues);
            yield client.query('COMMIT');
            resolve("Teacher inserted successfully");
        }
        catch (error) {
            console.log(error);
            yield client.query('ROLLBACK');
            reject(error);
        }
        finally {
            client.release();
        }
    }));
};
const modifyTeacher = (teacher) => {
    console.log(teacher);
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const client = yield pool.connect();
        try {
            yield client.query('BEGIN');
            const personUpdateQuery = `
                UPDATE person
                SET firstname = $1,
                    lastname  = $2
                    WHERE person_id = $3
            `;
            const personValues = [
                teacher.firstname,
                teacher.lastname,
                teacher.id
            ];
            yield client.query(personUpdateQuery, personValues);
            const teacherUpdateQuery = `
                UPDATE teacher
                SET abbreviation = $1,
                    image_url    = $2,
                    title        = $3
                WHERE teacher_id = $4
            `;
            const teacherValues = [
                teacher.abbreviation,
                teacher.image_url,
                teacher.title,
                teacher.id
            ];
            yield client.query(teacherUpdateQuery, teacherValues);
            yield client.query('COMMIT');
            resolve("Teacher modified successfully");
        }
        catch (error) {
            console.log(error);
            yield client.query('ROLLBACK');
            reject(error);
        }
        finally {
            client.release();
        }
    }));
};
module.exports = {
    getTeachers,
    insertTeacher,
    modifyTeacher
};
