import {QueryResult} from 'pg';
import {pool} from "../config/pgDatabaseInit";
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