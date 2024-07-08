import Debug from 'debug';
import { StatusCodes } from 'http-status-codes';
import User from "../models/user.js"
import ChatRoom from "../models/chatRoom.js"

const debug = Debug('controllers:chatroomParticipants');

//TODO: Check if ids are numbers

export const createChatRoomForTwo = async (req, res) => {
	const { senderId } = req.query;
	const { receiverId } = req.body;
	if (!senderId) {
		return res.status(StatusCodes.BAD_REQUEST).send('SenderId Not Found');
	}
	if (!receiverId) {
		return res.status(StatusCodes.BAD_REQUEST).send('ReceiverId Not Found');
	}

	try {
		const sender = await User.findByPk(senderId);
		const receiver = await User.findByPk(receiverId);

		if (!sender) {
			return res.status(StatusCodes.NOT_FOUND).send('Sender Not Found');
		}
		if (!receiver) {
			return res.status(StatusCodes.NOT_FOUND).send('Receiver Not Found');
		}
		let chatRoom = await sender.getChatRooms({
			include: [{
				model: User,
				where: { id: receiverId }
			}]
		});
		//TODO: Simplify Search
		for (const room of chatRoom) {
			const count = await room.countUsers();
			if (count === 2) {
				return res.status(StatusCodes.OK).json({ message: 'Chat Room already Exists', id: room.id });
			}
		}
		chatRoom = await ChatRoom.create();

		await sender.addChatRoom(chatRoom);
		await receiver.addChatRoom(chatRoom);

		return res.status(StatusCodes.CREATED).json({ message: 'Chat Room Created and Linked', id: chatRoom.id })
	} catch (err) {
		debug(err);
		debug(err.original);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('can\'t create chat room');
	}
}

export const createChatRoom = async (req, res) => {
	const { senderId } = req.query;
	const { receiverIds } = req.body;
	if (!senderId) {
		return res.status(StatusCodes.BAD_REQUEST).send('SenderId Not Found');
	}
	if (!receiverIds) {
		return res.status(StatusCodes.BAD_REQUEST).send('ReceiverIds Not Found');
	}
	const allUsers = [Number.parseInt(senderId), ...(receiverIds.map((id) => Number.parseInt(id)))];
	const allCount = allUsers.length;

	try {
		const sender = await User.findByPk(senderId);

		if (!sender) {
			return res.status(StatusCodes.NOT_FOUND).send('Sender Not Found');
		}
		let chatRoom = await sender.getChatRooms();
		for (const room of chatRoom) {
			const participants = (await room.getUsers()).map((user) => user.id);
			debug(allUsers.every((id) => participants.includes(id)));
			if (participants.length === allCount &&
				allUsers.every((id) => participants.includes(id))) {

				return res.status(StatusCodes.OK).json({ message: 'Chat Room already Exists', id: room.id });
			}
		}

		chatRoom = await ChatRoom.create();

		await sender.addChatRoom(chatRoom);
		const promises = receiverIds.map(async (receiverId) => {
			const receiver = await User.findByPk(receiverId);
			if (!receiver) {
				throw new Error("Not Found");
			}
			await receiver.addChatRoom(chatRoom);
		});
		try {
			await Promise.all(promises);
		} catch (error) {
			if (error.message === "Not Found") {
				return res.status(StatusCodes.NOT_FOUND).send('Receiver Not Found');
			}
			throw error;
		}

		return res.status(StatusCodes.CREATED).json({ message: 'Chat Room Created and Linked', id: chatRoom.id })
	} catch (err) {
		debug(err);
		debug(err.original);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('can\'t create chat room');
	}
}
