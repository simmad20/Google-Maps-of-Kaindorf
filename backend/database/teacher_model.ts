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
        pool.query('SELECT teacher_id as "id", firstname, lastname, title, abbreviation, image_url FROM person INNER JOIN teacher ON person_id = teacher_id', (error: any, result: QueryResult<ITeacher>) => {
            if (error) {
                reject(error);
            }
            resolve(result.rows);
        })
    })
}

module.exports = {
    getTeachers
}