import { DataTypes, Model } from 'sequelize';
import { db as sequelize } from '../db.js';

class Message extends Model { }

Message.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    unique: true,
  },

  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, { sequelize });


// export default function messageFunc(sequelize, DataTypes) {
//   message.associate = function associateMessage(models) {
//     message.belongsTo(models.user, {
//       onDelete: 'cascade',
//       foreignKey: {
//         allowNull: false,
//       },
//     });
// message.belongsTo(models.classroom, {
//   onDelete: 'cascade',
// });
//   };

//   return message;
// };

export default Message;
