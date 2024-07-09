import Debug from 'debug';
import Message from "../models/message.js";
import { StatusCodes } from 'http-status-codes';

const debug = Debug('controllers:message');

export const createMessage = async (req, res) => {
  const { content, userId } = req.body;

  if (!content || content === '') {
    debug('Cannot make empty message');
    return res.status(401).send('Cannot make empty message');
  }

  try {
    const message = await Message.create({
      content,
      userId,
    });

    return res.status(201).send({ id: message.id });
  } catch (err) {
    debug(`can't create message err: ${err}`);
    return res.status(401).send(`can't create message err: ${err}`);
  }
}

export const sendToRoom = async (req, res) => {
  const { user } = req;
  const { content } = req.body;
  const { id: ChatRoomId } = req.params;
  debug(req.params);

  if (!ChatRoomId) {
    return res.status(StatusCodes.BAD_REQUEST).send("ChatRoomId can't be null");
  }

  if (!content || content === '') {
    debug('Cannot make empty message');
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).send('Cannot make empty message');
  }

  try {
    const message = await user.createMessage({
      content,
      ChatRoomId
    });

    return res.status(StatusCodes.CREATED).send({ id: message.id });
  } catch (err) {
    debug(`can't create message err: ${err}`);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`can't create message err: ${err}`);
  }
}

export const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.findAll();
    return res.status(200).json(messages);
  } catch (err) {
    debug(`can't get messages err: ${err}`);
    return res.status(401).send(`can't get messages err: ${err}`);
  }
}

export const getMessage = async (req, res) => {
  const { id } = req.params;

  try {
    const message = await Message.findOne({
      where: {
        id,
      },
    });

    return res.status(200).json(message);
  } catch (err) {
    debug(`can't get message err: ${err}`);
    return res.status(401).send(`can't get message err: ${err}`);
  }
}

export const getMessagesByUserId = async (req, res) => {
  const { user } = req;

  try {
    const messages = await user.getMessages();

    return res.status(200).json(messages);
  } catch (err) {
    debug(`can't get messages err: ${err}`);
    return res.status(401).send(`can't get messages err: ${err}`);
  }
}
export const getRoomMessages = async (req, res) => {
  const { user } = req;
  const { id: ChatRoomId } = req.params;

  if (!ChatRoomId) {
    return res.status(StatusCodes.BAD_REQUEST).send("id not found");
  }

  try {
    const messages = await user.getMessages({
      where: {
        ChatRoomId
      }
    });

    return res.status(200).json(messages);
  } catch (err) {
    debug(`can't get messages err: ${err}`);
    return res.status(401).send(`can't get messages err: ${err}`);
  }
}

export const updateMessage = async (req, res) => {
  const { id } = req.params;

  try {
    const message = await Message.update({
      content: req.body.content,
    }, {
      where: {
        id,
      },
    });

    return res.status(200).json(message);
  } catch (err) {
    debug(`can't update message err: ${err}`);
    return res.status(304).send(`can't update message err: ${err}`);
  }
}

export const deleteMessage = async (req, res) => {
  const { id } = req.params;

  try {
    const message = await Message.findOne({
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
    debug(`can't delete message err: ${err}`);
    return res.status(401).send(`can't delete message err: ${err}`);
  }

}

export const deleteMessageByUserId = async (req, res) => {
  const { userId } = req.query;

  try {
    const messages = await user.getMessages();

    const promises = messages.map((message) => message.destroy());
    await Promise.all(promises);
    return res.status(200).send(`messages with user id: ${userId} deleted`);
  } catch (err) {
    debug(`can't delete messages err: ${err}`);
    return res.status(401).send(`can't delete messages err: ${err}`);
  }
}
