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
const getFeedback = () => {
    return new Promise(function (resolve, reject) {
        pgDatabaseInit_1.pool.query(`SELECT id, feedback
                    FROM feedback`, (error, result) => {
            if (error) {
                reject(error);
            }
            resolve(result.rows);
        });
    });
};
const insertFeedback = (feedback) => {
    console.log(feedback);
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const client = yield pgDatabaseInit_1.pool.connect();
        try {
            yield client.query('BEGIN');
            const feedbackInsertQuery = `
                INSERT INTO feedback (id, feedback)
                VALUES ($1, $2)
            `;
            const feedbackValues = [
                feedback.id,
                feedback.feedback
            ];
            const feedbackResult = yield client.query(feedbackInsertQuery, feedbackValues);
            const feedbackId = feedbackResult.rows[0].id;
            yield client.query(feedbackInsertQuery, feedbackValues);
            yield client.query('COMMIT');
            resolve("feedback inserted successfully");
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
const modifyFeedback = (feedback) => {
    console.log(feedback);
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const client = yield pgDatabaseInit_1.pool.connect();
        try {
            yield client.query('BEGIN');
            const feedbackUpdateQuery = `
                UPDATE feedback
                SET feedback = $2
                    WHERE id = $1
            `;
            const feedbackValues = [
                feedback.id,
                feedback.feedback,
            ];
            yield client.query(feedbackUpdateQuery, feedbackValues);
            yield client.query(feedbackUpdateQuery, feedbackValues);
            yield client.query('COMMIT');
            resolve("feedback modified successfully");
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
module.exports = {
    getFeedback,
    insertFeedback,
    modifyFeedback
};
