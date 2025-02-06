import {Pool} from "pg";

export const pool: Pool= new Pool({
    user: 'postgres',
    host: 'localhosta',
    database: 'mapsOfKaindorf',
    password: 'admin',
    port: 5432
})