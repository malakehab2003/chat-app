export default function userFunc (sequelize, Datatype) {
  const user = sequelize.define('user', {
    id: {
      type: Datatype.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
    },

    name: {
      type: Datatype.STRING,
      allowNull: false,
    },

    email: {
      type: Datatype.STRING,
      allowNull: false,
      unique: true,
    },

    password: {
      type: Datatype.STRING,
      allowNull: false,
    },

    createdAt: {
      type: Datatype.DATE,
      allowNull: false,
      defaultValue: Datatype.NOW,
    },

    updatedAt: {
      type: Datatype.DATE,
      allowNull: false,
      defaultValue: Datatype.NOW,
    },
  });

  user.associate = function associateUser(models) {
    user.hasMany(models.message, {
      onDelete: 'cascade',
    });
    // user.hasMany(models.classroom, {
    //   onDelete: 'cascade',
    // });
  };

  return user;
};
