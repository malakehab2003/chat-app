import { io } from 'socket.io-client';

const SocketURL = 'http://localhost:3000/';
export const socket = io(SocketURL);

export const BackEndBase = 'http://localhost:3000/api/';

export const startConnection = (id) => {
	socket.emit('start', id);
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

let tokenConst;
let userId;

export const getToken = () => {
	if (!tokenConst) {
		tokenConst = localStorage.getItem('token');
	}
	if (!tokenConst) {
		throw new Error('Sign in Required');
	}
	return tokenConst;
};

export const setToken = (param) => {
	localStorage.setItem('token', param);
	tokenConst = param;
};

export const clearData = () => {
	localStorage.clear();
	tokenConst = null;
	userId = null;
};

export const getId = () => {
	if (!userId) {
		userId = localStorage.getItem('userId');
	}
	if (!userId) {
		throw new Error('Sign in Required');
	}
	return parseInt(userId);
};

export const setId = (param) => {
	localStorage.setItem('userId', param);
	userId = param;
};

export const testEmail = (value) => {
	const regex =
		/^([a-zA-Z0-9._%+-]+@(gmail|yahoo)\.com)(,\s[a-zA-Z0-9._%+-]+@(gmail|yahoo)\.com)*$/;

	return regex.test(value);
};
