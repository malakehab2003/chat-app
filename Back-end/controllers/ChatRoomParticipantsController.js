import Debug from 'debug';
import { StatusCodes } from 'http-status-codes';
import User from "../models/user.js"
import ChatRoom from "../models/chatRoom.js"

const debug = Debug('controllers:chatroomParticipants');

export const createChatRoom = async (req, res) => {
	const { senderId, receiverId } = req.query;

	try {
		const sender = await User.findByPk(senderId);
		const receiver = await User.findByPk(receiverId);

		if (!sender) {
			return res.status(StatusCodes.NOT_FOUND).send('Sender Not Found');
		}
		if (!receiver) {
			return res.status(StatusCodes.NOT_FOUND).send('Receiver Not Found');
		}
		const chatRoom = await ChatRoom.create();

		await sender.addChatRoom({ chatRoom });
		await receiver.addChatRoom({ chatRoom });
	} catch (err) {
		debug(err);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('can\'t create chat room');
	}
}
