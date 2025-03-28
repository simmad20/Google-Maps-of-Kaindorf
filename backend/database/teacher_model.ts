import {QueryResult} from 'pg';
import {pool} from "../config/pgDatabaseInit";

import {ITeacher} from "../models/interfaces";

const getTeachers = (): Promise<ITeacher[]> => {
    return new Promise(function (resolve, reject) {
        pool.query(`SELECT t.teacher_id as "id",
                           p.firstname,
                           p.lastname,
                           t.title,
                           t.abbreviation,
                           t.image_url,
                           s.room_id
                    FROM person p
                             INNER JOIN teacher t ON person_id = teacher_id
                             LEFT JOIN school_room s ON p.person_id = s.teacher_id
                        AND s.valid_from = (SELECT MAX(valid_from)
                                            FROM school_room
                                            WHERE teacher_id = s.teacher_id)`, (error: any, result: QueryResult<ITeacher>) => {
            if (error) {
                reject(error);
            }
            resolve(result.rows);
        })
    })
}

const insertTeacher = (teacher: ITeacher): Promise<string> => {
    console.log(teacher);
    return new Promise(async (resolve, reject) => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const personInsertQuery = `
                INSERT INTO person (firstname, lastname)
                VALUES ($1, $2) RETURNING person_id as "id"
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

const assignTeacherToRoom = (teacherId: number, roomId: number): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const query = `
                INSERT INTO school_room (teacher_id, room_id, valid_from)
                VALUES ($1, $2, NOW()) RETURNING teacher_id, room_id, valid_from;
            `;

            const values = [teacherId, roomId];

            const result = await client.query(query, values);

            await client.query('COMMIT');

            resolve(result.rows[0]);
        } catch (error) {
            console.log(error);
            await client.query('ROLLBACK');
            reject(error);
        } finally {
            client.release();
        }
    });
};


module.exports = {
    getTeachers,
    insertTeacher,
    modifyTeacher,
    assignTeacherToRoom
}