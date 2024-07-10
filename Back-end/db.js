import { Sequelize } from 'sequelize';
import { promisify } from 'util';
import { config } from 'dotenv';
import { createConnection } from 'mysql2';
import Debug from "debug";

var debug = Debug('db:util');

// Load environment variables from .env file
const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
config({ path: envFile });

const sequelize = new Sequelize(
	process.env.DB_NAME,
	process.env.DB_USER,
	process.env.DB_PASSWORD, {
	host: process.env.DB_HOST,
	dialect: process.env.DB_DIALECT,
	dialectOptions: {
		charset: 'utf8mb4',
	},
	define: {
		charset: 'utf8mb4',
		collate: 'utf8mb4_unicode_ci'
	}
});

const ensureDBSetup = async () => {
	debug("Ensuring DB Exists");
	try {
		await sequelize.authenticate();
		debug("DB and USER Exists");
	} catch (error) {
		if (error.original && ['ER_BAD_DB_ERROR', 'ER_ACCESS_DENIED_ERROR', 'ER_DBACCESS_DENIED_ERROR'].includes(error.original.code)) {
			debug("Creating DB and USER");
			const connection = createConnection(
				{
					host: process.env.DB_HOST,
					user: process.env.MYSQL_ROOT_USER,
					password: process.env.MYSQL_ROOT_PASSWORD
				}
			);
			debug("Connection init");
			const asyncQuery = promisify(connection.query).bind(connection);
			try {
				await asyncQuery(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
				debug(`Database ${process.env.DB_NAME} created or already exists.`);
				await asyncQuery(`CREATE USER IF NOT EXISTS '${process.env.DB_USER}'@'%' IDENTIFIED WITH mysql_native_password BY '${process.env.DB_PASSWORD}';`);
				debug(`User ${process.env.DB_USER} created or already exists.`);
				await asyncQuery(`GRANT ALL PRIVILEGES ON \`${process.env.DB_NAME}\`.* TO '${process.env.DB_USER}'@'%';`);
				debug(`Granted all privileges on ${process.env.DB_NAME} to ${process.env.DB_USER}.`);
				await asyncQuery('FLUSH PRIVILEGES;');
				debug(`Privileges flushed.`);
				connection.end((err) => {
					if (err) throw err;
					debug('Disconnected from database.');
				});
			} catch (err) {
				debug(err)
			}
		} else {
			// Log any other error
			console.error('Unable to connect to the database:', error);
		}
	} finally {
		// Close the Sequelize connection
		return true;
	}
}

export const db = sequelize;
export const checkDB = ensureDBSetup;
