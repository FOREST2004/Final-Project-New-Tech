import { DataTypes } from 'sequelize';

const MessageModel = (sequelize) => {
  const Message = sequelize.define('Message', {
    message_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    admin_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    is_from_admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_ai_response: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'messages',
    timestamps: false
  });

  // Associations
  Message.associate = (models) => {
    Message.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
    Message.belongsTo(models.User, {
      foreignKey: 'admin_id',
      as: 'admin'
    });
  };

  return Message;
};

export default MessageModel;