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
const pgDatabaseInit_1 = require("../config/pgDatabaseInit");
const getTeachers = () => {
    return new Promise((resolve, reject) => {
        pgDatabaseInit_1.pool.query(`
            SELECT 
                t.teacher_id as "id",
                p.firstname,
                p.lastname,
                t.title,
                t.abbreviation,
                t.image_url
            FROM person p
            INNER JOIN teacher t ON p.person_id = t.teacher_id
        `, (error, result) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(result.rows);
            }
        });
    });
};
const insertTeacher = (teacher) => {
    console.log(teacher);
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const client = yield pgDatabaseInit_1.pool.connect();
        try {
            yield client.query('BEGIN');
            const personInsertQuery = `
                INSERT INTO person (firstname, lastname)
                VALUES ($1, $2)
                RETURNING person_id as "id"
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
        const client = yield pgDatabaseInit_1.pool.connect();
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
const assignTeacherToRoom = (teacherId, roomId) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield pgDatabaseInit_1.pool.connect();
    try {
        yield client.query('BEGIN');
        // 1. Prüfe ob Lehrer und Raum existieren
        const teacherExists = yield client.query('SELECT 1 FROM teacher WHERE teacher_id = $1', [teacherId]);
        const roomExists = yield client.query('SELECT 1 FROM room WHERE room_id = $1', [roomId]);
        if (teacherExists.rowCount === 0 || roomExists.rowCount === 0) {
            throw new Error('Lehrer oder Raum nicht gefunden');
        }
        // 2. Füge Zuordnung in school_room hinzu
        const insertQuery = `
            INSERT INTO school_room (teacher_id, room_id, valid_from)
            VALUES ($1, $2, NOW())
            RETURNING teacher_id, room_id, valid_from
        `;
        const result = yield client.query(insertQuery, [teacherId, roomId]);
        yield client.query('COMMIT');
        return result.rows[0];
    }
    catch (err) {
        yield client.query('ROLLBACK');
        const error = err;
        // Spezifische Fehlerbehandlung
        if (error.message.includes('foreign key')) {
            throw new Error('Ungültige Lehrer- oder Raum-ID');
        }
        if (error.message.includes('unique constraint')) {
            throw new Error('Diese Zuordnung existiert bereits');
        }
        throw error;
    }
    finally {
        client.release();
    }
});
const deleteTeacher = (teacherId) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield pgDatabaseInit_1.pool.connect();
    try {
        yield client.query('BEGIN');
        const teacherExists = yield client.query('SELECT 1 FROM teacher WHERE teacher_id = $1', [teacherId]);
        if (teacherExists.rowCount === 0) {
            throw new Error('Lehrer nicht gefunden');
        }
        yield client.query('DELETE FROM school_room WHERE teacher_id = $1', [teacherId]);
        yield client.query('DELETE FROM teacher WHERE teacher_id = $1', [teacherId]);
        yield client.query('DELETE FROM person WHERE person_id = $1', [teacherId]);
        yield client.query('COMMIT');
    }
    catch (error) {
        yield client.query('ROLLBACK');
        throw error;
    }
    finally {
        client.release();
    }
});
module.exports = {
    getTeachers,
    insertTeacher,
    modifyTeacher,
    assignTeacherToRoom,
    deleteTeacher
};
