import { getId, sendMessage } from '../constants';
import { createAuthorizedAxiosInstance } from './helpers';

let instance;

const getInstance = () => {
	if (!instance) {
		instance =
			createAuthorizedAxiosInstance('user/chatroom');
	}
	return instance;
};

export const GetAllMessages = async (chatId) => {
	getInstance();
	const res = await instance.get(`${chatId}`);
	const messages = res.data.map((message) => ({
		content: message.content,
		isSent: message.SenderId === getId(),
		User: message.User,
	}));
	return messages;
};

export const SendNewMessage = async (chatId, message) => {
	getInstance();
	await instance.post(`${chatId}`, {
		content: message,
	});
	//TODO: Send Signal to user
	sendMessage(chatId, message);
};

export const DeleteChat = async (id) => {
	try {
		const deleteInstance =
			createAuthorizedAxiosInstance('chatroom');
		await deleteInstance.delete(`${id}`);
	} catch (err) {
		console.error('Error deleting chat:', err);
		throw err;
	}
};
