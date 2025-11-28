import {Pool} from "pg";

export const pool: Pool= new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mapsOfKaindorf',
    password: 'postgres',
    port: 5432
})