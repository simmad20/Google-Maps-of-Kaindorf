import {Pool, QueryResult} from 'pg';

const pool: Pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mapsOfKaindorf',
    password: 'postgres',
    port: 5432
});

import {IFeedback} from "../models/interfaces";

const getFeedback = (): Promise<IFeedback[]> => {
    return new Promise(function (resolve, reject) {
        pool.query(`SELECT id, feedback
                    FROM feedback`, (error: any, result: QueryResult<IFeedback>) => {
            if (error) {
                reject(error);
            }
            resolve(result.rows);
        })
    })
}

const insertFeedback = (feedback: IFeedback): Promise<string> => {
    console.log(feedback);
    return new Promise(async (resolve, reject) => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const feedbackInsertQuery = `
                INSERT INTO feedback (id, feedback)
                VALUES ($1, $2)
            `;
            const feedbackValues = [
                feedback.id,
                feedback.feedback
            ];
            const feedbackResult = await client.query(feedbackInsertQuery, feedbackValues);

            const feedbackId = feedbackResult.rows[0].id;

            await client.query(feedbackInsertQuery, feedbackValues);

            await client.query('COMMIT');

            resolve("feedback inserted successfully");
        } catch (error) {
            console.log(error);
            await client.query('ROLLBACK');
            reject(error);
        } finally {
            client.release();
        }
    });
};

const modifyFeedback = (feedback: IFeedback): Promise<string> => {
    console.log(feedback);
    return new Promise(async (resolve, reject) => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const feedbackUpdateQuery = `
                UPDATE feedback
                SET feedback = $2
                    WHERE id = $1
            `;
            const feedbackValues = [
                feedback.id,
                feedback.feedback,
            ];

            await client.query(feedbackUpdateQuery, feedbackValues);

            await client.query(feedbackUpdateQuery, feedbackValues);

            await client.query('COMMIT');

            resolve("feedback modified successfully");
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
    getFeedback,
    insertFeedback,
    modifyFeedback
}