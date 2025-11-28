import {QueryResult} from 'pg';
import {pool} from "../config/pgDatabaseInit";
import {IRoom, IRoomDetailed, ITeacher} from "../models/interfaces";

const getRooms = (): Promise<IRoom[]> => {
    return new Promise((resolve, reject) => {
        pool.query(`
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
        `, (error: any, result: QueryResult<IRoom>) => {
            if (error) {
                reject(error);
            } else {
                resolve(result.rows);
            }
        });
    });
};
const getRoomWithTeacherDetails = (id: number): Promise<IRoomDetailed> => {
    return new Promise(async (resolve, reject) => {
        try {
            const roomResult: QueryResult<IRoomDetailed> = await pool.query(`
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
        } catch (error) {
            console.log(error);
            reject(error);
        }
    })

};

const insertRoom = (room: IRoom): Promise<IRoom> => {
    console.log(room);
    return new Promise(async (resolve, reject) => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const roomInsertQuery = `
                INSERT INTO room (room_number, name, x, y, width, height, building_id)
                VALUES ($1, NULLIF($2, ''), $3, $4, $5, $6, 1) RETURNING room_id as "id", room_number, name, x, y, width, height`;

            const roomResult: QueryResult<IRoom> = await client.query(roomInsertQuery, [room.room_number, room.name,
                room.x, room.y, room.width, room.height]);


            await client.query('COMMIT');

            resolve(roomResult.rows[0]);
        } catch (error) {
            console.log(error);
            await client.query('ROLLBACK');
            reject(error);
        } finally {
            client.release();
        }
    });
};

const deleteRoom = async (id: number): Promise<void> => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const roomExists = await client.query(
            'SELECT 1 FROM room WHERE room_id = $1',
            [id]
        );

        if (roomExists.rowCount === 0) {
            throw new Error('Raum nicht gefunden');
        }

        await client.query(
            'DELETE FROM school_room WHERE room_id = $1',
            [id]
        );

        const deleteResult = await client.query(
            'DELETE FROM room WHERE room_id = $1 RETURNING *',
            [id]
        );

        if (deleteResult.rowCount === 0) {
            throw new Error('Löschen fehlgeschlagen');
        }

        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

const deleteAssignedRoomTeacher = async (room_id: number, teacher_id: number): Promise<void> => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const roomExists = await client.query(
            'SELECT 1 FROM room WHERE room_id = $1',
            [room_id]
        );

        if (roomExists.rowCount === 0) {
            throw new Error('Raum nicht gefunden');
        }

        const deleteResult = await client.query(
            'DELETE FROM school_room WHERE room_id = $1 AND teacher_id = $2',
            [room_id, teacher_id]
        );

        if (deleteResult.rowCount === 0) {
            throw new Error('Löschen fehlgeschlagen');
        }

        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

const updateRoom = (room: IRoom): Promise<IRoom> => {
    return new Promise(async (resolve, reject) => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const updateQuery = `
                UPDATE room 
                SET room_number = $1, 
                    name = NULLIF($2, ''), 
                    x = $3, 
                    y = $4, 
                    width = $5, 
                    height = $6
                WHERE room_id = $7
                RETURNING room_id as "id", room_number, name, x, y, width, height`;

            const result: QueryResult<IRoom> = await client.query(updateQuery, [
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

            await client.query('COMMIT');
            resolve(result.rows[0]);
        } catch (error) {
            await client.query('ROLLBACK');
            reject(error);
        } finally {
            client.release();
        }
    });
};

module.exports = {
    getRooms,
    insertRoom,
    deleteRoom,
    getRoomWithTeacherDetails,
    deleteAssignedRoomTeacher,
    updateRoom
}