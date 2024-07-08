import Debug from 'debug';
import User from "../models/user.js"
import { v4 as uuidv4 } from 'uuid';
import redisClient from '../utils/redisClient.js';
import sha1 from 'sha1';

const debug = Debug('controllers:user');

export const createToken = async (id) => {
  const token = uuidv4();
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

    const token = await createToken(user.id);

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

export const getUserByEmail = async (email, res) => {
  try {
    const user = await User.findOne({
      where: {
        email,
      },
    });

    return user;
  } catch (err) {
    debug(`can't find user err: ${err}`);
    return res.status(401).send(`can't find user err: ${err}`);
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

export const deleteUserByEmail = async (req, res) => {
  const { email } = req.query;

  try {
    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.destroy();

    return res.status(200).send(`user with email: ${email} deleted`);
  } catch (err) {
    debug(`can't delete user err: ${err}`);
    return res.status(401).send(`can't delete user err: ${err}`);
  }
}

export const validateEmail = (email) => {
  const regex = /^[a-zA-Z0-9._%+-]+@(gmail|yahoo)\.com$/;
  return regex.test(email);
}

const validatePassword = (password, res) => {
  if (password.length < 8) {
    debug('Password must be at least 8 characters long');
    res.status(401).send('Password must be at least 8 characters long');
    return false;
  }

  if (!/[0-9]/.test(password)) {
    debug('Password must contain at least one digit');
    res.status(401).send('Password must contain at least one digit');
    return false;
  }

  if (!/[@_#$]/.test(password)) {
    debug('Password must contain at least one special character (@, _, #, $)');
    res.status(401).send('Password must contain at least one special character (@, _, #, $)');
    return false;
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
    password === '' ||
    !validatePassword(password, res)
  ) {
    return res.status(401).send('Invalid Password!');
  }

  if (!redisClient.isAlive()) {
    console.log('redis is not alive');
    return res.status(401).send('redis is not alive');
  }

  return createUser(req, res);
}

export const signIn = async (req, res) => {
  let Authorization = req.header('Authorization');

  // check that Authorization is not empty
  if (!Authorization) {
    debug('Header should contain Authorization');
    return res.status(401).send('Header should contain Authorization');
  }

  // check Authorization contain Bearer
  if (Authorization.slice(0, 7) !== 'Bearer ') {
    debug('Header should contain Bearer');
    return res.status(401).send('Header should contain Bearer');
  }

  // remove Bearer
  Authorization = Authorization.replace('Bearer ', '');

  // decode the Authorization
  let decodedAuth = Buffer.from(Authorization, 'base64');
  decodedAuth = decodedAuth.toString('utf-8');

  // split email and password
  const arr = decodedAuth.split(':');
  const email = arr[0];
  const password = arr[1];

  // check if empty
  if (!email || !password) {
    debug('Not correct Auth');
    return res.status(401).send('Not correct Auth');
  }

  // hash password
  const hash_password = sha1(password);

  // get user by email if found
  const user = await getUserByEmail(email, res);

  // check user is not null
  if (!user) {
    debug('No user found');
    return res.status(401).send('No user found');
  }

  // check password
  if (user.password === hash_password) {
    debug('Wrong password!');
    return res.status(401).send('Wrong password!');
  }

  // create token to the session and save it in cache
  const token = await createToken(user.id.toString());

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
