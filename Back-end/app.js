import express, { json, urlencoded } from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import ChatRoom from './models/chatRoom.js';
import Message from './models/message.js';
import User from './models/user.js';

import indexRouter from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

User.hasMany(Message, {
	onDelete: 'cascade',
	foreignKey: {
		field: 'SenderId',
		name: 'SenderId',
		allowNull: false,
	},
});

// TODO: Associate Many Users to Many ChatRooms
User.belongsToMany(ChatRoom, {
	through: 'ChatRoomParticipants',
});
ChatRoom.belongsToMany(User, {
	through: 'ChatRoomParticipants',
});

Message.belongsTo(User, {
	onDelete: 'cascade',
	foreignKey: {
		field: 'SenderId',
		name: 'SenderId',
		allowNull: false,
	},
});

ChatRoom.hasMany(Message, {
	foreignKey: {
		allowNull: false,
	},
});
Message.belongsTo(ChatRoom, {
	onDelete: 'cascade',
	foreignKey: {
		allowNull: false,
	},
});

var app = express();
app.use(logger('dev'));
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, 'public')));

app.use('/api', indexRouter);

export default app;
