import { DataTypes, Model } from 'sequelize';
import { db as sequelize } from '../db.js';

class User extends Model { }

User.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    unique: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  bio: {
    type: DataTypes.TEXT,
    defaultValue: 'Hello world',
  },

  image: {
    type: DataTypes.STRING,
    defaultValue: 'user',
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, { sequelize });

export default User;
