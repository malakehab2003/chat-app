export default function messageFunc (sequelize, DataTypes) {
  const message = sequelize.define('message', {
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

    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  message.associate = function associateMessage(models) {
    message.belongsTo(models.user, {
      onDelete: 'cascade',
      foreignKey: {
        allowNull: false,
      },
    });
    // message.belongsTo(models.classroom, {
    //   onDelete: 'cascade',
    // });
  };

  return message;
};
