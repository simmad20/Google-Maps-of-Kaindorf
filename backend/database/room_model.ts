import {Pool, QueryResult} from 'pg';

const pool: Pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mapsOfKaindorf',
    password: 'postgres',
    port: 5432
});

import {IRoom} from "../models/interfaces";

const getRooms = (): Promise<IRoom[]> => {
    return new Promise(function (resolve, reject) {
        pool.query(`SELECT room_id as "id", room_number, COALESCE(name, '')
                    FROM room`, (error: any, result: QueryResult<IRoom>) => {
            if (error) {
                reject(error);
            }
            resolve(result.rows);
        })
    })
}



module.exports = {
    getRooms
}