import Debug from "debug";

import * as UserController from "../controllers/UserController.js";
import { HeaderNotFoundError, IncorrectPasswordError, InvalidTokenError, UserNotFoundError } from '../utils/errors.js';
import { StatusCodes } from 'http-status-codes';

const debug = Debug("utils:auth");

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
