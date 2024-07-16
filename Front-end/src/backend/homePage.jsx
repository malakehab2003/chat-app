import { createAuthorizedAxiosInstance } from './helpers';

let instance;

const getInstance = () => {
	if (!instance) {
		instance = createAuthorizedAxiosInstance('chatroom');
	}
	return instance;
};

export const GetAllChatsRequest = async () => {
	getInstance();
	try {
		const res = await instance.get('/');
		const result = res.data.map((chatroom) => ({
			name: chatroom.Users.map((user) => user.name).join(
				', '
			),
			lastMessage:
				chatroom.Messages.length === 0
					? 'No Messages'
					: chatroom.Messages[0].latestMessage,
			id: chatroom.id,
		}));
		return result;
	} catch (err) {
		console.error('Error during chats retrieval:', err);
	}
};
