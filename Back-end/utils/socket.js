import { Server } from "socket.io";
import Debug from "debug";
import User from "../models/user.js";

const debug = Debug("utils:socket");

//TODO: Test Sockets

let Socket;

export const initializeSocket = (server) => {
	const io = new Server(server);
	io.on('connection', (socket) => {
		socket.once('start', async (id) => {
			const user = await User.findByPk(id);
			debug(user);
			const rooms = await user.getChatRooms({
				attributes: ['id'],
				joinTableAttributes: []
			});
			debug(rooms);
			for (const room of rooms) {
				socket.join(`chat-no-${room.id}`);
			}
		})
		socket.on('typing-message', (id) => {
			debug("on Typing");
			debug(id);
			socket.to(`chat-no-${id}`).emit('typing', id);
		});
		socket.on('stop-typing-message', (id) => {
			debug("on Stop Typing");
			debug(id);
			socket.to(`chat-no-${id}`).emit('stop', id);
		});
		socket.on('send-message', ({ id, message }) => {
			debug("on Sending");
			debug(id);
			debug(message);
			socket.to(`chat-no-${id}`).emit('send', { id, message });
		});
	});
};

export const getSocket = () => {
	if (!Socket) {
		throw new Error("Socket.io not initialized");
	}

	return Socket;
}
