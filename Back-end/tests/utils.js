import { createConnection } from 'mysql2';
import { promisify } from 'util';
import { config } from 'dotenv';

// Load environment variables from .env file
const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
config({ path: envFile });

const connection = createConnection(
	{
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
	}
);

export const asyncQuery = promisify(connection.query).bind(connection);

export const closeConnection = () => connection.end((err) => {
	if (err) throw err;
});

export const clearTable = (table) => asyncQuery(`DELETE FROM ${table};`);
