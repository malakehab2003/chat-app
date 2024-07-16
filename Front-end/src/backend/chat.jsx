import { id } from '../constants';
import { createAuthorizedAxiosInstance } from './helpers';

const instance =
	createAuthorizedAxiosInstance('user/chatroom');

export const GetAllMessages = async (chatId) => {
	const res = await instance.get(`${chatId}`);
	const messages = res.data.map((message) => ({
		content: message.content,
		isSent: message.SenderId === id,
	}));
	return messages;
};
