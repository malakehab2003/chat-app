import Debug from "debug";

import { StatusCodes } from 'http-status-codes';
import { config } from 'dotenv';
import jsonwebtoken from 'jsonwebtoken';
import * as UserController from "../controllers/UserController.js";
import redisClient from '../utils/redisClient.js';
import { HeaderNotFoundError, IncorrectPasswordError, InvalidTokenError, UserNotFoundError } from '../utils/errors.js';


// configure env variables
const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
config({ path: envFile });

const debug = Debug("utils:auth");

const SECONDS = 1;
const MINUTES = 60 * SECONDS;
const HOURS = 60 * MINUTES;
const DAYS = 24 * HOURS;

export const createToken = async (email, id) => {

	// get the secret key from the env
	const jwtSecretKey = process.env.JWT_SECRET_KEY;

	// define data
	const data = {
		email
	}
	const duration = DAYS;
	// create token
	const token = jsonwebtoken.sign(data, jwtSecretKey, {
		expiresIn: duration
	});
	await redisClient.set(token, id, duration);
	return token;
}

export const AuthRequest = async (req, res, next) => {
	const authHeader = req.get('Authorization');
	debug(authHeader);

	try {
		const user = await UserController.getUserFromToken(authHeader);

		if (user) {
			req.user = user;
		}

		next();
	} catch (err) {
		switch (true) {
			case err instanceof HeaderNotFoundError:
				// Handle HeaderNotFoundError
				res.status(StatusCodes.BAD_REQUEST).send({ error: 'Header not found' });
				break;
			case err instanceof InvalidTokenError:
				// Handle InvalidTokenError
				res.status(StatusCodes.UNAUTHORIZED).send({ error: 'Invalid token' });
				break;
			case err instanceof UserNotFoundError:
				// Handle UserNotFoundError
				res.status(StatusCodes.NOT_FOUND).send({ error: 'User not found' });
				break;
			default:
				debug(err)
				// Handle other errors
				res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: 'Internal server error' });
				break;
		}
	}
}
