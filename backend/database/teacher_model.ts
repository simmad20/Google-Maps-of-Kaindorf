import {QueryResult} from 'pg';
import {pool} from "../config/pgDatabaseInit";

import {ITeacher} from "../models/interfaces";

const getTeachers = (): Promise<ITeacher[]> => {
    return new Promise((resolve, reject) => {
        pool.query(`
            SELECT 
                t.teacher_id as "id",
                p.firstname,
                p.lastname,
                t.title,
                t.abbreviation,
                t.image_url
            FROM person p
            INNER JOIN teacher t ON p.person_id = t.teacher_id
        `, (error: any, result: QueryResult<ITeacher>) => {
            if (error) {
                reject(error);
            } else {
                resolve(result.rows);
            }
        });
    });
};

const insertTeacher = (teacher: ITeacher): Promise<string> => {
    console.log(teacher);
    return new Promise(async (resolve, reject) => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const personInsertQuery = `
                INSERT INTO person (firstname, lastname)
                VALUES ($1, $2)
                RETURNING person_id as "id"
            `;
            const personValues = [
                teacher.firstname,
                teacher.lastname
            ];
            const personResult = await client.query(personInsertQuery, personValues);

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
            ]
            await client.query(teacherInsertQuery, teacherValues);

            await client.query('COMMIT');

            resolve("Teacher inserted successfully");
        } catch (error) {
            console.log(error);
            await client.query('ROLLBACK');
            reject(error);
        } finally {
            client.release();
        }
    });
};

const modifyTeacher = (teacher: ITeacher): Promise<string> => {
    console.log(teacher);
    return new Promise(async (resolve, reject) => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

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

            await client.query(personUpdateQuery, personValues);

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
            ]

            await client.query(teacherUpdateQuery, teacherValues);

            await client.query('COMMIT');

            resolve("Teacher modified successfully");
        } catch (error) {
            console.log(error);
            await client.query('ROLLBACK');
            reject(error);
        } finally {
            client.release();
        }
    });
};

const assignTeacherToRoom = async (teacherId: number, roomId: number): Promise<any> => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Prüfe ob Lehrer und Raum existieren
        const teacherExists = await client.query(
            'SELECT 1 FROM teacher WHERE teacher_id = $1',
            [teacherId]
        );
        const roomExists = await client.query(
            'SELECT 1 FROM room WHERE room_id = $1',
            [roomId]
        );

        if (teacherExists.rowCount === 0 || roomExists.rowCount === 0) {
            throw new Error('Lehrer oder Raum nicht gefunden');
        }

        // 2. Füge Zuordnung in school_room hinzu
        const insertQuery = `
            INSERT INTO school_room (teacher_id, room_id, valid_from)
            VALUES ($1, $2, NOW())
            RETURNING teacher_id, room_id, valid_from
        `;
        const result = await client.query(insertQuery, [teacherId, roomId]);

        await client.query('COMMIT');
        return result.rows[0];
    } catch (err) {
        await client.query('ROLLBACK');
        const error: Error = err as Error;

        // Spezifische Fehlerbehandlung
        if (error.message.includes('foreign key')) {
            throw new Error('Ungültige Lehrer- oder Raum-ID');
        }
        if (error.message.includes('unique constraint')) {
            throw new Error('Diese Zuordnung existiert bereits');
        }

        throw error;
    } finally {
        client.release();
    }
};

const deleteTeacher = async (teacherId: number): Promise<void> => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const teacherExists = await client.query(
            'SELECT 1 FROM teacher WHERE teacher_id = $1',
            [teacherId]
        );

        if (teacherExists.rowCount === 0) {
            throw new Error('Lehrer nicht gefunden');
        }

        await client.query(
            'DELETE FROM school_room WHERE teacher_id = $1',
            [teacherId]
        );

        await client.query(
            'DELETE FROM teacher WHERE teacher_id = $1',
            [teacherId]
        );

        await client.query(
            'DELETE FROM person WHERE person_id = $1',
            [teacherId]
        );

        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

module.exports = {
    getTeachers,
    insertTeacher,
    modifyTeacher,
    assignTeacherToRoom,
    deleteTeacher
}