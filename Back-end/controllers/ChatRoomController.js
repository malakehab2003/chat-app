import Debug from 'debug';
import ChatRoom from '../models/chatRoom.js';
import User from '../models/user.js';

const debug = Debug('controllers:chatroom');

export const createChatRoom = async (req, res) => {
	try {
		const room = await ChatRoom.create();
		return res.status(201).send({ id: room.id });
	} catch (error) {
		debug(`can't create message err: ${err}`);
		return res.status(401).send(`can't create message err: ${err}`);
	}
};

export const getAllChatRooms = async (req, res) => {
	try {

		const rooms = await ChatRoom.findAll();
		res.status(200).json(rooms);
	} catch (err) {
		debug(err);
		return res.status(401).send('can\'t get chat rooms');
	}
};

export const getChatRoomById = async (req, res) => {
	const { id } = req.params;

	try {
		const room = await ChatRoom.findByPk(id);
		if (!room) {
			return res.status(404).send('can\'t get chat room');
		}
		return res.status(200).json(room);
	} catch (error) {
		debug(err);
		return res.status(401).send('can\'t get chat room');
	}
}

export const getRoomsByUserId = async (req, res) => {
	const { userId } = req.query;

	try {
		const user = await User.findByPk(userId);
		const rooms = await user.getChatRooms();
		return res.status(200).json(rooms);
	} catch (error) {
		debug(err);
		return res.status(401).send('can\'t get chat rooms');
	}
}

export const deleteRoom = async (req, res) => {
	const { id } = req.params;

	try {
		const room = await ChatRoom.findByPk(id);
		if (!room) {
			return res.status(404).send('can\'t get chat room');
		}
		await room.destroy();
		return res.status(200).send('room deleted');
	} catch (error) {
		debug(err);
		return res.status(401).send('can\'t delete chat room');
	}
}

export const deleteRoomByUserId = async (req, res) => {
	const { userId } = req.query;
	try {
		const user = await User.findByPk(userId);
		const rooms = await user.getChatRooms();
		const promises = rooms.map((room) => room.destroy());
		await Promise.all(promises);
		return res.status(200).send('rooms deleted');
	} catch (err) {
		debug(err);
		return res.status(401).send('can\'t delete chat rooms');
	}
}
