import { getId } from '../constants';
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
	}));
	return messages;
};
