import pg from 'pg';
import config from '../config/index.js';

const { Pool } = pg;

const pool = new Pool({
    connectionString: config.database.url,
    ssl: { rejectUnauthorized: false }
});

export default {
    query: (text, params) => pool.query(text, params),
    pool
};
