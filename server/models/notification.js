import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Notification = sequelize.define('notification', {
  Notification_ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Recipient_ID: { type: DataTypes.INTEGER, allowNull: false },
  Type: { type: DataTypes.STRING, allowNull: false },
  Message_Content: { type: DataTypes.TEXT, allowNull: false },
  Date_Sent: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  Notification_Status: { type: DataTypes.STRING, allowNull: false },
});

export default Notification;
