import Debug from 'debug';
import sha1 from 'sha1';
import dotenv from 'dotenv';
import jsonwebtoken from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import User from '../models/user.js';
import redisClient from '../utils/redisClient.js';
import {
	HeaderNotFoundError,
	IncorrectPasswordError,
	InvalidTokenError,
	UserNotFoundError,
} from '../utils/errors.js';
import { createToken } from '../utils/auth.js';
import path from 'path';

// TODO: Check Token Duration

// configure env variables
dotenv.config();

const debug = Debug('controllers:user');

export const validateEmail = (email) => {
	const regex = /^[a-zA-Z0-9._%+-]+@(gmail|yahoo)\.com$/;
	return regex.test(email);
};

const validatePassword = (password) => {
	if (password.length < 8) {
		debug('Password must be at least 8 characters long');
		throw new Error(
			'Password must be at least 8 characters long'
		);
	}

	if (!/[0-9]/.test(password)) {
		debug('Password must contain at least one digit');
		throw new Error(
			'Password must contain at least one digit'
		);
	}

	if (!/[@_#$]/.test(password)) {
		debug(
			'Password must contain at least one special character (@, _, #, $)'
		);
		throw new Error(
			'Password must contain at least one special character (@, _, #, $)'
		);
	}

	return true;
};

const getUserByEmail = async (email) => {
	try {
		const user = await User.findOne({
			where: {
				email,
			},
		});

		return user;
	} catch (err) {
		throw new Error(err);
	}
};

export const getUserFromToken = async (Authorization) => {
	// check that Authorization is not empty
	if (!Authorization) {
		debug('Header should contain Authorization');
		throw new HeaderNotFoundError();
	}

	// check Authorization contain Bearer
	if (Authorization.slice(0, 7) !== 'Bearer ') {
		debug('Header should contain Bearer');
		throw new InvalidTokenError();
	}

	// remove Bearer
	const token = Authorization.replace('Bearer ', '');

	// check valid token
	const jwtSecretKey = process.env.JWT_SECRET_KEY;

	let email;

	try {
		const verified = jsonwebtoken.verify(
			token,
			jwtSecretKey
		);
		if (verified) {
			email = verified.email;
		}
		const currentTime = Math.floor(Date.now() / 1000); // Current time in Unix timestamp
		if (verified.exp < currentTime) {
			debug('Token has expired');
			throw new InvalidTokenError();
		}
	} catch (err) {
		debug(err);
		throw new InvalidTokenError();
	}

	// check if empty
	if (!email) {
		debug('Not correct Auth');
		throw new InvalidTokenError();
	}

	// get user by email if found
	let user;
	try {
		user = await getUserByEmail(email);
	} catch (err) {
		debug(err);
		throw new Error(err);
	}

	// check user is not null
	if (!user) {
		debug('No user found');
		throw new UserNotFoundError();
	}

	return user;
};

////////////////////////////////////////////////////////////////////////////////////////

export const getUserByEmailFromBody = async (req, res) => {
	const { email } = req.params;
	console.log('siiiiiiiiiiiiiiiii', email);

	try {
		const user = await getUserByEmail(email);

		if (!user) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.send('User not found');
		}
		return res.status(StatusCodes.OK).send({ user });
	} catch (err) {
		debug(err);
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.send(err);
	}
};

export const createUser = async (req, res) => {
	const { name, email, password } = req.body;

	const hash_password = sha1(password);

	try {
		const user = await User.create({
			name,
			email,
			password: hash_password,
		});

		const token = await createToken(user.email, user.id);

		return res
			.status(StatusCodes.CREATED)
			.send({ token, id: user.id });
	} catch (err) {
		debug(`can't create user err: ${err}`);
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.send(`can't create user`);
	}
};

export const getUser = async (req, res) => {
	const { id } = req.params;

	try {
		const user = await User.findOne({
			attributes: { exclude: ['password'] },
			where: {
				id,
			},
		});

		return res.status(StatusCodes.OK).json(user);
	} catch (err) {
		debug(`can't find user err: ${err}`);
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.send(`can't find user`);
	}
};

export const getAllUser = async (req, res) => {
	try {
		const users = await User.findAll({
			attributes: { exclude: ['password'] },
		});

		return res.status(StatusCodes.OK).json(users);
	} catch (err) {
		debug(`can't get users err: ${err}`);
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.send(`can't get users`);
	}
};

export const getUserByToken = async (req, res) => {
	const { user } = req;
	delete user.dataValues.password;
	return res.json(user);
};

export const updateUser = async (req, res) => {
	const { user } = req;
	const { id } = req.params;

	if (user.id !== id) {
		return res
			.status(StatusCodes.UNAUTHORIZED)
			.send("Can't Update User");
	}

	try {
		await User.update(
			{
				name: req.body.name,
				email: req.body.email,
				password: req.body.password,
			},
			{
				where: {
					id,
				},
			}
		);

		return res.status(StatusCodes.OK).send('User Updated');
	} catch (err) {
		debug(`can't update user err: ${err}`);
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.send(`can't update user`);
	}
};

export const deleteUser = async (req, res) => {
	const { id } = req.params;

	try {
		const user = await User.findOne({
			where: {
				id,
			},
		});

		if (!user) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ error: 'User not found' });
		}

		await user.destroy();

		return res
			.status(StatusCodes.OK)
			.send(`user with id: ${id} deleted`);
	} catch (err) {
		debug(`can't delete user err: ${err}`);
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.send(`can't delete user`);
	}
};

export const deleteUserByToken = async (req, res) => {
	const { user } = req;
	const auth = req.header('Authorization');

	if (!auth) {
		debug('No token found!');
		return res
			.status(StatusCodes.BAD_REQUEST)
			.send('No token found!');
	}

	// check Authorization contain Bearer
	if (auth.slice(0, 7) !== 'Bearer ') {
		debug('Header should contain Bearer');
		throw new InvalidTokenError();
	}

	// remove Bearer
	const token = auth.replace('Bearer ', '');

	try {
		await user.destroy();

		const id = await redisClient.get(token);
		if (!id) {
			debug('Incorrect token!');
			return res
				.status(StatusCodes.BAD_REQUEST)
				.send('Incorrect token!');
		}

		await redisClient.del(token);

		return res
			.status(StatusCodes.OK)
			.send(`current user deleted`);
	} catch (err) {
		debug(`can't delete user err: ${err}`);
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.send(`can't delete user err: ${err}`);
	}
};

export const signUp = (req, res) => {
	const { name, email, password } = req.body;

	// check valid name
	if (!name || name === '') {
		debug('Invalid user name!');
		return res
			.status(StatusCodes.BAD_REQUEST)
			.send('Invalid user name!');
	}

	// check valid email
	if (!email || email === '' || !validateEmail(email)) {
		debug('Invalid Email!');
		return res
			.status(StatusCodes.BAD_REQUEST)
			.send('Invalid Email!');
	}

	// check valid password
	if (!password || password === '') {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.send('Invalid Password!');
	}

	try {
		validatePassword(password);
	} catch (err) {
		debug(err);
		return res.status(StatusCodes.BAD_REQUEST).send(err);
	}

	if (!redisClient.isAlive()) {
		console.log('redis is not alive');
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.send('redis is not alive');
	}

	return createUser(req, res);
};

export const signIn = async (req, res) => {
	// let Authorization = req.header('Authorization');
	const { email, pass } = req.body;
	if (!email) {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.send('email not found');
	}
	if (!pass) {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.send('pass not found');
	}

	let user;
	try {
		user = await getUserByEmail(email);
	} catch (err) {
		debug(err);
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.send(err);
	}

	if (!user) {
		return res
			.status(StatusCodes.NOT_FOUND)
			.send('User not found');
	}
	const hashed_pass = sha1(pass);
	if (user.password !== hashed_pass) {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.send('Invalid Password');
	}
	// create token to the session and save it in cache
	const token = await createToken(
		user.email,
		user.id.toString()
	);

	return res
		.status(StatusCodes.OK)
		.json({ token, id: user.id });
};

export const signOut = async (req, res) => {
	const token = req.header('Authorization');

	if (!token) {
		debug('No token found!');
		return res
			.status(StatusCodes.BAD_REQUEST)
			.send('No token found!');
	}

	try {
		const id = await redisClient.get(token);
		if (!id) {
			debug('Incorrect token!');
			return res
				.status(StatusCodes.BAD_REQUEST)
				.send('Incorrect token!');
		}

		await redisClient.del(token);
		return res
			.status(StatusCodes.OK)
			.send('Signed out successfully');
	} catch (err) {
		debug(`Cannot sign out err: ${err}`);
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.send(`Cannot sign out`);
	}
};

export const changePass = async (req, res) => {
	const { oldPass, newPass } = req.body;
	const { user } = req;

	if (!oldPass || !newPass || !user) {
		debug('Cannot change password');
		return res
			.status(StatusCodes.BAD_REQUEST)
			.send('cannot change password');
	}

	const hash_old = sha1(oldPass);

	if (hash_old !== user.password) {
		debug('Incorrect Password');
		return res
			.status(StatusCodes.BAD_REQUEST)
			.send(new IncorrectPasswordError());
	}

	const hash_password = sha1(newPass);

	try {
		await User.update(
			{
				password: hash_password,
			},
			{
				where: {
					id: user.id,
				},
			}
		);

		return res
			.status(StatusCodes.OK)
			.send('Password changed');
	} catch (err) {
		debug('cannot update password');
		return res
			.status(StatusCodes.BAD_REQUEST)
			.send('cannot update password');
	}
};

export const changeName = async (req, res) => {
	const { name } = req.body;
	const { user } = req;

	if (!name || !user) {
		debug('Cannot change name');
		return res
			.status(StatusCodes.BAD_REQUEST)
			.send('cannot change name');
	}

	try {
		await User.update(
			{
				name,
			},
			{
				where: {
					id: user.id,
				},
			}
		);

		return res.status(StatusCodes.OK).send('Name changed');
	} catch (err) {
		debug('cannot update name');
		return res
			.status(StatusCodes.BAD_REQUEST)
			.send('cannot update name');
	}	
}

export const changeBio = async (req, res) => {
	const { bio } = req.body;
	const { user } = req;

	if (!bio || !user) {
		debug('Cannot change bio');
		return res
			.status(StatusCodes.BAD_REQUEST)
			.send('cannot change bio');
	}

	try {
		await User.update(
			{
				bio,
			},
			{
				where: {
					id: user.id,
				},
			}
		);

		return res
			.status(StatusCodes.OK)
			.send('Bio changed');
	} catch (err) {
		debug('cannot update bio');
		return res
			.status(StatusCodes.BAD_REQUEST)
			.send('cannot update bio');
	}	
}

export const changeImg = async (req, res) => {
	try {
		const { user } = req;
		const profilePicPath = req.file.path;

		const imageName = path.basename(profilePicPath);
    
    const relativeImagePath = `image/${imageName}`;

		await User.update({ image: relativeImagePath }, { where: { id: user.id } });
		res.status(200).json({ message: 'Profile picture updated successfully' });
	} catch (err) {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.send('cannot update image');
	}
}
