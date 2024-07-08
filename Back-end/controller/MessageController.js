import db from '../models/index';

export async function createMessage(req, res) {
  const { content, userId } = req.body;

  try {
    const message = await db.message.create({
      content,
      userId,
    });

    return res.status(201).send({ id: message.id });
  } catch (err) {
    console.log(`can't create message err: ${err}`);
    return res.status(401).send(`can't create message err: ${err}`);
  }
}

export async function getAllMessages(req, res) {
  const messages = await db.message.findAll();

  try {
    return res.status(200).json(messages);
  } catch (err) {
    console.log(`can't get messages err: ${err}`);
    return res.status(401).send(`can't get messages err: ${err}`);
  }
}

export async function getMessage(req, res) {
  const { id } = req.params;

  try {
    const message = await db.message.findOne({
      where: {
        id,
      },
    });

    return res.status(200).json(message);
  } catch (err) {
    console.log(`can't get message err: ${err}`);
    return res.status(401).send(`can't get message err: ${err}`);
  }
}

export async function getMessageByUserId(req, res) {
  const { userId } = req.query;

  try {
    const messages = await db.message.findAll({
      where: {
        userId,
      },
    });

    return res.status(200).json(messages);
  } catch (err) {
    console.log(`can't get messages err: ${err}`);
    return res.status(401).send(`can't get messages err: ${err}`);
  }
}

export async function updateMessage (req, res) {
  const { id } = req.params;

  try {
    const message = await db.message.update({
      content: req.body.content,
    }, {
      where: {
        id,
      },
    });

    return res.status(200).json(message);
  } catch (err) {
    console.log(`can't update message err: ${err}`);
    return res.status(304).send(`can't update message err: ${err}`);
  }
}

export async function deleteMessage(req, res) {
  const { id } = req.params;

  try {
    const message = await db.message.findOne({
      where: {
        id,
      },
    });

    if (!message) {
      return res.status(404).json({ error: 'User not found' });
    }

    await message.destroy();

    return res.status(200).send(`message with id: ${id} deleted`);
  } catch (err) {
    console.log(`can't delete message err: ${err}`);
    return res.status(401).send(`can't delete message err: ${err}`);
  }

}

export async function deleteMessageByUserId (req, res) {
  const { userId } = req.query;

  try {
    const messages = await db.message.findAll({
      where: {
        userId,
      },
    });

    await messages.forEach((message) => {message.destroy()});
    return res.status(200).send(`messages with user id: ${userId} deleted`);
  } catch (err) {
    console.log(`can't delete messages err: ${err}`);
    return res.status(401).send(`can't delete messages err: ${err}`);
  }
}
