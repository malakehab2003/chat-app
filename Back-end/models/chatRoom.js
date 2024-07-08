import { DataTypes, Model } from 'sequelize';
import { db as sequelize } from '../db.js';

class ChatRoom extends Model { }

ChatRoom.init({
	id: {
		type: DataTypes.BIGINT,
		primaryKey: true,
		autoIncrement: true,
	}
}, { sequelize });

export default ChatRoom;
