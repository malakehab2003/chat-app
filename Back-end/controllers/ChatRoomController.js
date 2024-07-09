import Debug from 'debug';
import { StatusCodes } from 'http-status-codes';
import ChatRoom from '../models/chatRoom.js';
import User from '../models/user.js';

const debug = Debug('controllers:chatroom');

export const createChatRoom = async (req, res) => {
	debug(req.user);
	try {
		const room = await ChatRoom.create();
		return res.status(StatusCodes.CREATED).send({ id: room.id });
	} catch (error) {
		debug(error);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`can't create chat room`);
	}
};

export const getAllChatRooms = async (req, res) => {
	try {

		const rooms = await ChatRoom.findAll();
		res.json(rooms);
	} catch (err) {
		debug(err);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('can\'t get chat rooms');
	}
};

export const getChatRoomById = async (req, res) => {
	const { id } = req.params;
	if (!id) {
		return res.status(StatusCodes.BAD_REQUEST).send('Id is Required');
	}

	try {
		const room = await ChatRoom.findByPk(id);
		if (!room) {
			return res.status(StatusCodes.NOT_FOUND).send('can\'t get chat room');
		}
		return res.json(room);
	} catch (error) {
		debug(err);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('can\'t get chat room');
	}
}

export const getRoomsByUserId = async (req, res) => {
	const { userId } = req.query;

	if (!userId) {
		return res.status(StatusCodes.BAD_REQUEST).send('UserId is Required');
	}

	try {
		const user = await User.findByPk(userId);
		const rooms = await user.getChatRooms();
		return res.json(rooms);
	} catch (error) {
		debug(err);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('can\'t get chat rooms');
	}
}

export const deleteRoom = async (req, res) => {
	const { id } = req.params;

	if (!id) {
		return res.status(StatusCodes.BAD_REQUEST).send('Id is Required')
	}

	try {
		const room = await ChatRoom.findByPk(id);
		if (!room) {
			return res.status(StatusCodes.NOT_FOUND).send('can\'t get chat room');
		}
		await room.destroy();
		return res.status(StatusCodes.NO_CONTENT).send('room deleted');
	} catch (error) {
		debug(err);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('can\'t delete chat room');
	}
}

export const deleteRoomByUserId = async (req, res) => {
	const { userId } = req.query;
	if (!userId) {
		return res.status(StatusCodes.BAD_REQUEST).send('UserId is Required');
	}
	try {
		const user = await User.findByPk(userId);
		const rooms = await user.getChatRooms();
		const promises = rooms.map((room) => room.destroy());
		await Promise.all(promises);
		return res.send('rooms deleted');
	} catch (err) {
		debug(err);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('can\'t delete chat rooms');
	}
}
