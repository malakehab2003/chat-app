import Debug from 'debug';
import Message from '../models/message.js';
import { StatusCodes } from 'http-status-codes';
import ChatRoom from '../models/chatRoom.js';

const debug = Debug('controllers:message');

export const createMessage = async (req, res) => {
	const { content, userId } = req.body;

	if (!content || content === '') {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.send('Cannot make empty message');
	}

	try {
		const message = await Message.create({
			content,
			userId,
		});

		return res
			.status(StatusCodes.CREATED)
			.send({ id: message.id });
	} catch (err) {
		debug(`can't create message err: ${err}`);
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.send(`can't create message err`);
	}
};

export const sendToRoom = async (req, res) => {
	const { user } = req;
	const { content } = req.body;
	const { id: ChatRoomId } = req.params;
	debug(req.params);

	if (!ChatRoomId) {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.send("ChatRoomId can't be null");
	}

	if (!content || content === '') {
		debug('Cannot make empty message');
		return res
			.status(StatusCodes.BAD_REQUEST)
			.send('Cannot make empty message');
	}

	const roomExists =
		(await user.countChatRooms({
			where: { id: ChatRoomId },
		})) === 1;

	if (!roomExists) {
		return res
			.status(StatusCodes.NOT_FOUND)
			.send("ChatRoom doesn't exist");
	}

	try {
		const message = await user.createMessage({
			content,
			ChatRoomId,
		});

		return res
			.status(StatusCodes.CREATED)
			.send({ id: message.id });
	} catch (err) {
		debug(`can't create message err: ${err}`);
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.send(`can't create message err`);
	}
};

export const getAllMessages = async (req, res) => {
	try {
		const messages = await Message.findAll();
		return res.status(StatusCodes.OK).json(messages);
	} catch (err) {
		debug(`can't get messages err: ${err}`);
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.send(`can't get messages err`);
	}
};

export const getMessage = async (req, res) => {
	const { id } = req.params;

	try {
		const message = await Message.findOne({
			where: {
				id,
			},
		});

		return res.status(StatusCodes.OK).json(message);
	} catch (err) {
		debug(`can't get message err: ${err}`);
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.send(`can't get message err`);
	}
};

export const getMessagesByUserId = async (req, res) => {
	const { user } = req;

	try {
		const messages = await user.getMessages();

		return res.status(StatusCodes.OK).json(messages);
	} catch (err) {
		debug(`can't get messages err: ${err}`);
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.send(`can't get messages err`);
	}
};
export const getRoomMessages = async (req, res) => {
	const { user } = req;
	const { id: ChatRoomId } = req.params;

	if (!ChatRoomId) {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.send('id not found');
	}

	const room = await ChatRoom.findByPk(ChatRoomId);

	if (!room) {
		return res
			.status(StatusCodes.NOT_FOUND)
			.send("ChatRoom doesn't exist");
	}

	try {
		const messages = await room.getMessages();

		return res.status(StatusCodes.OK).json(messages);
	} catch (err) {
		debug(`can't get messages err: ${err}`);
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.send(`can't get messages err`);
	}
};

export const updateMessage = async (req, res) => {
	const {
		user: { id: SenderId },
	} = req;
	const { id } = req.params;
	const { content } = req.body;

	if (!id) {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.send('Id is Invalid');
	}

	if (!content || content === '') {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.send('Content is Invalid');
	}

	try {
		const message = await Message.update(
			{
				content,
			},
			{
				where: {
					id,
					SenderId,
				},
			}
		);

		if (message[0] === 0) {
			return res
				.status(StatusCodes.UNAUTHORIZED)
				.send(
					"Can't Update message as you aren't the owner, or it doesn't exist"
				);
		}

		return res
			.status(StatusCodes.OK)
			.send('Message Updated');
	} catch (err) {
		debug(`can't update message err: ${err}`);
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.send(`can't update message`);
	}
};

export const deleteMessage = async (req, res) => {
	const { id } = req.params;
	const {
		user: { id: SenderId },
	} = req;

	try {
		const message = await Message.findOne({
			where: {
				id,
			},
		});

		if (!message) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.send('Message not found');
		}

		if (message.SenderId !== SenderId) {
			return res
				.status(StatusCodes.UNAUTHORIZED)
				.json('You are not the Owner');
		}

		await message.destroy();

		return res
			.status(StatusCodes.OK)
			.send(`message with id: ${id} deleted`);
	} catch (err) {
		debug(`can't delete message err: ${err}`);
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.send(`can't delete message`);
	}
};

export const deleteMessageByUserId = async (req, res) => {
	const { user } = req;

	try {
		const messages = await user.getMessages();

		const promises = messages.map((message) =>
			message.destroy()
		);
		await Promise.all(promises);
		return res
			.status(StatusCodes.OK)
			.send(`messages with user id: ${user.id} deleted`);
	} catch (err) {
		debug(`can't delete messages err: ${err}`);
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.send(`can't delete messages`);
	}
};

export const getLastMessage = async (req, res) => {
	const { roomId } = req.body;
	const { user } = req;

	if (!roomId) {
		debug('No room id');
		return res
			.status(StatusCodes.BAD_REQUEST)
			.send('No room id');
	}

	try {
		const room = await ChatRoom.findOne({
			where: {
				id: roomId,
			},
		});

		if (!room) {
			debug(`No room with id: ${roomId}`);
		}

		const lastMessage = await Message.findOne({
			where: {
				ChatRoomId: roomId,
			},
			order: [['createdAt', 'DESC']],
		});

		return res
			.status(StatusCodes.OK)
			.send({ message: lastMessage });
	} catch (err) {
		debug(`Cannot get message err: ${err}`);
		return res
			.status(StatusCodes.BAD_REQUEST)
			.send(`Cannot get message err: ${err}`);
	}
};
