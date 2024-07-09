import Debug from 'debug';
import User from "../models/user.js"
import redisClient from '../utils/redisClient.js';
import sha1 from 'sha1';
import { HeaderNotFoundError, InvalidTokenError, UserNotFoundError } from '../utils/errors.js';
import dotenv from 'dotenv';
import jsonwebtoken from 'jsonwebtoken';

const debug = Debug('controllers:user');

export const createToken = async (email, id) => {
  // configure env variables
  dotenv.config();

  // get the secret key from the env
  const jwtSecretKey = process.env.JWT_SECRET_KEY;

  // define data
  const data = {
    email
  }

  // create token
  const token = jsonwebtoken.sign(data, jwtSecretKey);
  await redisClient.set(token, id, 86400);
  return token;
}

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

    return res.status(201).send({ token });
  } catch (err) {
    debug(`can't create user err: ${err}`);
    return res.status(401).send(`can't create user err: ${err}`);
  }
}

export const getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findOne({
      where: {
        id,
      },
    });

    return res.status(200).json(user);
  } catch (err) {
    debug(`can't find user err: ${err}`);
    return res.status(401).send(`can't find user err: ${err}`);
  }
}

export const getAllUser = async (req, res) => {
  try {
    const users = await User.findAll();

    return res.status(200).json(users);
  } catch (err) {
    debug(`can't get users err: ${err}`);
    return res.status(401).send(`can't get users err: ${err}`);
  }
}

export const getUserByToken = async (req, res) => {
  const { user } = req;
  return res.json(user);
}

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
}

export const updateUser = async (req, res) => {
  try {
    const user = await User.update({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    }, {
      where: {
        id: req.params.id,
      },
    });

    return res.status(200).json(user);
  } catch (err) {
    debug(`can't update user err: ${err}`);
    return res.status(304).send(`can't update user err: ${err}`);
  }
}

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findOne({
      where: {
        id
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.destroy();

    return res.status(200).send(`user with id: ${id} deleted`);
  } catch (err) {
    debug(`can't delete user err: ${err}`);
    return res.status(401).send(`can't delete user err: ${err}`);
  }
}

export const deleteUserByToken = async (req, res) => {
  const { user } = req;

  try {

    await user.destroy();

    return res.status(200).send(`current user deleted`);
  } catch (err) {
    debug(`can't delete user err: ${err}`);
    return res.status(401).send(`can't delete user err: ${err}`);
  }
}

export const validateEmail = (email) => {
  const regex = /^[a-zA-Z0-9._%+-]+@(gmail|yahoo)\.com$/;
  return regex.test(email);
}

const validatePassword = (password) => {
  if (password.length < 8) {
    debug('Password must be at least 8 characters long');
    throw new Error('Password must be at least 8 characters long');
  }

  if (!/[0-9]/.test(password)) {
    debug('Password must contain at least one digit');
    throw new Error('Password must contain at least one digit');
  }

  if (!/[@_#$]/.test(password)) {
    debug('Password must contain at least one special character (@, _, #, $)');
    throw new Error('Password must contain at least one special character (@, _, #, $)');
  }

  return true;
};

export const signUp = (req, res) => {
  const { name, email, password } = req.body;

  // check valid name
  if (!name || name === '') {
    debug('Invalid user name!');
    return res.status(401).send('Invalid user name!');
  }

  // check valid email
  if (
    !email ||
    email === '' ||
    !validateEmail(email)
  ) {
    debug('Invalid Email!');
    return res.status(401).send('Invalid Email!');
  }

  // check valid password
  if (
    !password ||
    password === ''
  ) {
    return res.status(401).send('Invalid Password!');
  }

  try {
    validatePassword(password);
  } catch (err) {
    debug(err);
    res.status(401).send(err);
  }

  if (!redisClient.isAlive()) {
    console.log('redis is not alive');
    return res.status(401).send('redis is not alive');
  }

  return createUser(req, res);
}

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
  const tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
  const jwtSecretKey = process.env.JWT_SECRET_KEY;

  let email;

  try {
    const verified = jsonwebtoken.verify(token, jwtSecretKey);
    if (verified) {
      email = verified.email;
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
    debug(err)
    return res.status(401).send(err);
  }

  // check user is not null
  if (!user) {
    debug('No user found');
    throw new UserNotFoundError();
  }

  return user;
}

export const signIn = async (req, res) => {
  // let Authorization = req.header('Authorization');
  const { email, pass } = req.body;
  if (!email) {
    return res.status(401).send('email not found');
  }
  if (!pass) {
    return res.status(401).send('pass not found');
  }
  // get user from token
  // const user = await getUserFromToken(Authorization, res);
  let user;
  try {
    user = await getUserByEmail(email);
  } catch (err) {
    debug(err);
    return res.status(401).send(err);
  }

  if (!user) {
    return res.status(404).send("User not found");
  }
  const hashed_pass = sha1(pass);
  if (user.password !== hashed_pass) {
    return res.status(401).send('Invalid Password');
  }
  // create token to the session and save it in cache
  const token = await createToken(user.email, user.id.toString());

  return res.status(200).json({ token });
}

export const signOut = async (req, res) => {
  const token = req.header('token');

  if (!token) {
    debug('No token found!');
    return res.status(401).send('No token found!');
  }

  try {
    const id = await redisClient.get(token);
    if (!id) {
      debug('Incorrect token!');
      return res.status(401).send('Incorrect token!');
    }

    await redisClient.del(token);
    return res.status(200).send('Signed out successfully');
  } catch (err) {
    debug(`Cannot sign out err: ${err}`);
    return res.status(401).send(`Cannot sign out err: ${err}`);
  }
}
