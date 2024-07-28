import { io } from 'socket.io-client';

const SocketURL = 'http://localhost:3000/';
export const socket = io(SocketURL, {
	reconnectionAttempts: 5, // Number of reconnection attempts before giving up
	reconnectionDelay: 1000, // Delay between reconnection attempts
	autoConnect: false,
});

export const BackEndBase = 'http://localhost:3000/api/';

export const startConnection = (id) => {
	if (!socket.connected) {
		socket.connect();
	}
	console.log('Starting Connection');
	socket.emit('start', id);
};
export const endConnection = () => {
	socket.disconnect();
};

export const startTyping = (chatId) => {
	console.log('Typing from source');
	socket.emit('typing-message', chatId);
};

export const stopTyping = (chatId) => {
	socket.emit('stop-typing-message', chatId);
};

export const sendMessage = (chatId, message) => {
	socket.emit('send-message', { id: chatId, message });
};

export const addChatRoom = (chat) => {
	socket.emit('add-chat', chat);
};

export const deleteChatRoom = (chatId) => {
	socket.emit('delete-chat', chatId);
};

export const CLIENT_ID =
	'361250210633-14h3t6ov1q1llng3mkom9glqis93h9lt.apps.googleusercontent.com';

let tokenConst;
let user;

export const getToken = () => {
	console.log(`tokenConst: ${tokenConst}`);

	tokenConst = sessionStorage.getItem('token');

	if (!tokenConst) {
		throw new Error('Sign in Required');
	}
	return tokenConst;
};

export const setToken = (param) => {
	sessionStorage.setItem('token', param);
	tokenConst = param;
	console.log(`setting tokenConst: ${tokenConst}`);
};

export const clearData = () => {
	sessionStorage.clear();
	tokenConst = null;
	user = null;
};

export const getUser = () => {
	user = JSON.parse(sessionStorage.getItem('user'));
	console.log(`getting user:`, user);
	if (!user) {
		throw new Error('Sign in Required');
	}
	return user;
};

export const setUser = (param) => {
	sessionStorage.setItem('user', JSON.stringify(param));
	console.log(`settin user:`, param);
	user = param;
};

export const testEmail = (value) => {
	const regex =
		/^([a-zA-Z0-9._%+-]+@(gmail|yahoo)\.com)(,\s[a-zA-Z0-9._%+-]+@(gmail|yahoo)\.com)*$/;

	return regex.test(value);
};
