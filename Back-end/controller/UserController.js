import db from '../models/index';

export async function createUser(req, res) {
  const { name, email, password } = req.body;

  try {
    const user = await db.user.create({
      name,
      email,
      password,
    });

    return res.status(201).send({ id: user.id });
  } catch (err) {
    console.log(`can't create user err: ${err}`);
    return res.status(401).send(`can't create user err: ${err}`);
  }
}

export async function getUser(req, res) {
  const { id } = req.params;

  try {
    const user = await db.user.findOne({
      where: {
        id,
      },
    });

    return res.status(200).json(user);
  } catch (err) {
    console.log(`can't find user err: ${err}`);
    return res.status(401).send(`can't find user err: ${err}`);
  }
}

export async function getAllUser(req, res) {
  try {
    const users = await db.user.findAll();

    return res.status(200).json(users);
  } catch (err) {
    console.log(`can't get users err: ${err}`);
    return res.status(401).send(`can't get users err: ${err}`);
  }
}

export async function getUserByEmail(req, res) {
  const { email } = req.query;
  try {
    const user = await db.user.findOne({
      where: {
        email,
      },
    });

    return res.status(200).json(user);
  } catch (err) {
    console.log(`can't find user err: ${err}`);
    return res.status(401).send(`can't find user err: ${err}`);
  }
}

export async function updateUser(req, res) {
  try {
    const user = await db.user.update({
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
    console.log(`can't update user err: ${err}`);
    return res.status(304).send(`can't update user err: ${err}`);
  }
}

export async function deleteUser(req, res) {
  const { id } = req.params;

  try {
    const user = await db.user.findOne({
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
    console.log(`can't delete user err: ${err}`);
    return res.status(401).send(`can't delete user err: ${err}`);
  }
}

export async function deleteUserByEmail(req, res) {
  const { email } = req.query;

  try {
    const user = await db.user.findOne({
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
    console.log(`can't delete user err: ${err}`);
    return res.status(401).send(`can't delete user err: ${err}`);
  }
}
