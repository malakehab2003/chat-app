import { Server } from 'socket.io';
import Debug from 'debug';
import User from '../models/user.js';
import ChatRoom from '../models/chatRoom.js';

const debug = Debug('utils:socket');

//TODO: Test Sockets

let Socket;
const idsToSockets = {};

export const initializeSocket = (server) => {
	const io = new Server(server, {
		cors: {
			origin: '*',
		},
	});
	io.on('connection', (socket) => {
		socket.once('start', async (id) => {
			idsToSockets[id] = socket;
			const user = await User.findByPk(id);
			debug('From Start:', user);
			const rooms = await user.getChatRooms({
				attributes: ['id'],
				joinTableAttributes: [],
			});
			debug(rooms);
			for (const room of rooms) {
				socket.join(`chat-no-${room.id}`);
			}
		});
		socket.on('typing-message', (id) => {
			debug('on Typing');
			debug(id);
			socket.to(`chat-no-${id}`).emit('typing', id);
		});
		socket.on('stop-typing-message', (id) => {
			debug('on Stop Typing');
			debug(id);
			socket.to(`chat-no-${id}`).emit('stop', id);
		});
		socket.on('send-message', ({ id, message }) => {
			debug('on Sending');
			debug(id);
			debug(message);
			socket
				.to(`chat-no-${id}`)
				.emit('send', { id, message });
		});
		socket.on('add-chat', async (data) => {
			debug(data);
			socket.join(`chat-no-${data.id}`);
			const { Users } = data;
			const userId = Object.entries(idsToSockets).find(
				([key, val]) => val === socket
			)[0];
			const userName = (await User.findByPk(userId)).name;
			const addedUser = {
				name: userName,
				id: parseInt(userId),
			};
			for (const user of Users) {
				if (user.id in idsToSockets) {
					console.log(`user: ${user}`);
					const updatedUsers = [
						...Users.filter((u) => user.id !== u.id),
						addedUser,
					];
					const updatedData = {
						...data,
						Users: updatedUsers,
					};
					idsToSockets[user.id].emit(
						'addChat',
						updatedData
					);
					idsToSockets[user.id].join(`chat-no-${data.id}`);
				}
			}
		});
		socket.on('delete-chat', (id) => {
			debug(id);
			socket.to(`chat-no-${id}`).emit('deleteChat', id);
		});
	});
};

export const getSocket = () => {
	if (!Socket) {
		throw new Error('Socket.io not initialized');
	}

	return Socket;
};
