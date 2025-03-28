import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';

const teachersRouter = require('./routes/teachers');
const roomsRouter = require('./routes/rooms');

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/teachers', teachersRouter);
app.use('/rooms', roomsRouter)

module.exports = app;