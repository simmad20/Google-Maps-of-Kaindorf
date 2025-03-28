import {QueryResult} from 'pg';
import {pool} from "../config/pgDatabaseInit";
import {IRoom} from "../models/interfaces";

const getRooms = (): Promise<IRoom[]> => {
    return new Promise(function (resolve, reject) {
        pool.query(`SELECT r.room_id as "id", r.room_number, COALESCE(r.name, ''), r.x, r.y, r.width, r.height, s.teacher_id, s.valid_from
                    FROM room r LEFT JOIN school_room s USING (room_id)`, (error: any, result: QueryResult<IRoom>) => {
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