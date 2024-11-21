import {Pool, QueryResult} from 'pg';

const pool: Pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mapsOfKaindorf',
    password: 'postgres',
    port: 5432
});

import {ITeacher} from "../models/interfaces";

const getTeachers = (): Promise<ITeacher[]> => {
    return new Promise(function (resolve, reject) {
        pool.query(`SELECT teacher_id as "id", firstname, lastname, title, abbreviation, image_url
                    FROM person
                             INNER JOIN teacher ON person_id = teacher_id`, (error: any, result: QueryResult<ITeacher>) => {
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


module.exports = {
    getTeachers,
    insertTeacher,
    modifyTeacher
}