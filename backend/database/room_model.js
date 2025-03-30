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
const getRooms = () => {
    return new Promise((resolve, reject) => {
        pgDatabaseInit_1.pool.query(`
            SELECT r.room_id            as "id",
                   r.room_number,
                   COALESCE(r.name, '') as "name",
                   r.x,
                   r.y,
                   r.width,
                   r.height,
                   ARRAY_AGG(s.teacher_id) FILTER (WHERE s.teacher_id IS NOT NULL) as "teacher_ids"
            FROM room r
                     LEFT JOIN school_room s ON r.room_id = s.room_id
            GROUP BY r.room_id, r.room_number, r.name, r.x, r.y, r.width, r.height
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
const getRoomWithTeacherDetails = (id) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const roomResult = yield pgDatabaseInit_1.pool.query(`
                SELECT r.room_id as "id",
                       r.room_number,
                       r.name,
                       r.x,
                       r.y,
                       r.width,
                       r.height,
                       COALESCE(
                               JSON_AGG(
                                       JSON_BUILD_OBJECT(
                                               'id', t.teacher_id,
                                               'firstname', p.firstname,
                                               'lastname', p.lastname,
                                               'abbreviation', t.abbreviation,
                                               'image_url', t.image_url,
                                               'title', t.title
                                           )
                                   ) FILTER(WHERE t.teacher_id IS NOT NULL),
                               '[]'
                           )     as "teachers"
                FROM room r
                         LEFT JOIN school_room sr ON r.room_id = sr.room_id
                         LEFT JOIN teacher t ON sr.teacher_id = t.teacher_id
                         LEFT JOIN person p ON t.teacher_id = p.person_id
                WHERE r.room_id = $1
                GROUP BY r.room_id`, [id]);
            resolve(roomResult.rows[0]);
        }
        catch (error) {
            console.log(error);
            reject(error);
        }
    }));
};
const insertRoom = (room) => {
    console.log(room);
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const client = yield pgDatabaseInit_1.pool.connect();
        try {
            yield client.query('BEGIN');
            const roomInsertQuery = `
                INSERT INTO room (room_number, name, x, y, width, height, building_id)
                VALUES ($1, $2, $3, $4, $5, $6, 1) RETURNING room_id as "id", room_number, name, x, y, width, height`;
            const roomResult = yield client.query(roomInsertQuery, [room.room_number, room.name,
                room.x, room.y, room.width, room.height]);
            yield client.query('COMMIT');
            resolve(roomResult.rows[0]);
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
const deleteRoom = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield pgDatabaseInit_1.pool.connect();
    try {
        yield client.query('BEGIN');
        const roomExists = yield client.query('SELECT 1 FROM room WHERE room_id = $1', [id]);
        if (roomExists.rowCount === 0) {
            throw new Error('Raum nicht gefunden');
        }
        yield client.query('DELETE FROM school_room WHERE room_id = $1', [id]);
        const deleteResult = yield client.query('DELETE FROM room WHERE room_id = $1 RETURNING *', [id]);
        if (deleteResult.rowCount === 0) {
            throw new Error('Löschen fehlgeschlagen');
        }
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
const deleteAssignedRoomTeacher = (room_id, teacher_id) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield pgDatabaseInit_1.pool.connect();
    try {
        yield client.query('BEGIN');
        const roomExists = yield client.query('SELECT 1 FROM room WHERE room_id = $1', [room_id]);
        if (roomExists.rowCount === 0) {
            throw new Error('Raum nicht gefunden');
        }
        const deleteResult = yield client.query('DELETE FROM school_room WHERE room_id = $1 AND teacher_id = $2', [room_id, teacher_id]);
        if (deleteResult.rowCount === 0) {
            throw new Error('Löschen fehlgeschlagen');
        }
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
const updateRoom = (room) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const client = yield pgDatabaseInit_1.pool.connect();
        try {
            yield client.query('BEGIN');
            const updateQuery = `
                UPDATE room 
                SET room_number = $1, 
                    name = $2, 
                    x = $3, 
                    y = $4, 
                    width = $5, 
                    height = $6
                WHERE room_id = $7
                RETURNING room_id as "id", room_number, name, x, y, width, height`;
            const result = yield client.query(updateQuery, [
                room.room_number,
                room.name,
                room.x,
                room.y,
                room.width,
                room.height,
                room.id
            ]);
            if (result.rowCount === 0) {
                throw new Error('Raum nicht gefunden');
            }
            yield client.query('COMMIT');
            resolve(result.rows[0]);
        }
        catch (error) {
            yield client.query('ROLLBACK');
            reject(error);
        }
        finally {
            client.release();
        }
    }));
};
module.exports = {
    getRooms,
    insertRoom,
    deleteRoom,
    getRoomWithTeacherDetails,
    deleteAssignedRoomTeacher,
    updateRoom
};
