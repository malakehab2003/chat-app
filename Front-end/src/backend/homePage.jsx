import {
	clearLoginFlag,
	createAuthorizedAxiosInstance,
	isUserChanged,
} from './helpers';

let instance;

const getInstance = () => {
	if (!instance || isUserChanged()) {
		console.log('Created New Instance');
		instance = createAuthorizedAxiosInstance('chatroom');
		clearLoginFlag();
	}
	return instance;
};

let createInstance;

const getCreateInstance = () => {
	if (!createInstance || isUserChanged()) {
		console.log('Created New Instance');
		createInstance =
			createAuthorizedAxiosInstance('user/chatroom');
		clearLoginFlag();
	}
	return createInstance;
};

let userInstance;

const getUserInstance = () => {
	if (!userInstance || isUserChanged()) {
		console.log('Created New Instance');
		userInstance = createAuthorizedAxiosInstance('user');
		clearLoginFlag();
	}
	return userInstance;
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
			type: chatroom.roomType,
		}));
		return result;
	} catch (err) {
		console.error('Error during chats retrieval:', err);
	}
};

export const AddNewChat = async (email) => {
	getCreateInstance();
	getUserInstance();
	let chat;

	if (email.includes(', ')) {
		const emails = email.split(', ');
		const ids = [];
		for (const e of emails) {
			const res = await userInstance.get(`${e}`);
			const { user } = res.data;
			ids.push(user.id);
		}

		const respond = await createInstance.post('/group', {
			receiverIds: ids,
		});
		console.log(respond);
		if (respond.status === 200) {
			throw new Error('Already created');
		}

		// chat room id
		chat = respond.data;
	} else {
		const res = await userInstance.get(`${email}`);
		const { user } = res.data;

		const respond = await createInstance.post('', {
			receiverId: user.id,
		});
		console.log(respond);
		if (respond.status === 200) {
			throw new Error('Already created');
		}
		chat = respond.data;
	}

	const formattedChat = {
		name: chat.Users.map((user) => user.name)
			.sort()
			.join(', '),
		lastMessage:
			chat.Messages.length === 0
				? 'No Messages'
				: chat.Messages[0].latestMessage,
		id: chat.id,
		type: chat.roomType,
	};

	// chat room id
	return { chat, formattedChat };
};
