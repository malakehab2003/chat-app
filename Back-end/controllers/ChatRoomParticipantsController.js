import Debug from 'debug';
import { StatusCodes } from 'http-status-codes';
import User from "../models/user.js"
import ChatRoom from "../models/chatRoom.js"

const debug = Debug('controllers:chatroomParticipants');

export const createChatRoomForTwo = async (req, res) => {
	const { user: sender } = req;
	const { receiverId } = req.body;

	if (!receiverId) {
		return res.status(StatusCodes.BAD_REQUEST).send('ReceiverId Not Found');
	}

	try {
		const receiver = await User.findByPk(receiverId);

		if (!receiver) {
			return res.status(StatusCodes.NOT_FOUND).send('Receiver Not Found');
		}
		let chatRooms = await sender.getChatRooms({
			where: { roomType: 'direct' },
			include: [{
				model: User,
				where: { id: receiverId }
			}],
			joinTableAttributes: []
		});
		if (chatRooms.length > 0) {
			return res.status(StatusCodes.OK).json({ message: 'Chat Room already Exists', id: chatRooms[0].id });
		}
		const chatRoom = await ChatRoom.create({
			roomType: 'direct'
		});

		await sender.addChatRoom(chatRoom);
		await receiver.addChatRoom(chatRoom);

		return res.status(StatusCodes.CREATED).json({ message: 'Chat Room Created and Linked', id: chatRoom.id })
	} catch (err) {
		debug(err);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`can\'t create chat room err: ${err}`);
	}
}

export const createChatRoom = async (req, res) => {
	const { user: sender } = req;
	const { receiverIds } = req.body;

	if (!receiverIds || !Array.isArray(receiverIds) || receiverIds.some((id) => isNaN(id))) {
		return res.status(StatusCodes.BAD_REQUEST).send('Invalid receiverIds');
	}
	const allUsers = [sender.id, ...(receiverIds.map((id) => Number.parseInt(id)))];
	const allCount = allUsers.length;

	if (allCount === 2) {
		req.body.receiverId = receiverIds[0];
		return createChatRoomForTwo(req, res);
	}

	try {
		let chatRooms = await sender.getChatRooms({
			include: [{
				model: User,
				attributes: ['id'],
				through: { attributes: [] }, // Exclude join table attributes
			}],
		});
		for (const room of chatRooms) {
			const participants = room.Users.map((user) => user.id);
			if (participants.length === allCount &&
				allUsers.every((id) => participants.includes(id))) {
				return res.status(StatusCodes.OK).json({
					message: 'Chat Room already Exists',
					id: room.id
				});
			}
		}

		const chatRoom = await ChatRoom.create();

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
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`can\'t create chat room err: ${err}` );
	}
}
