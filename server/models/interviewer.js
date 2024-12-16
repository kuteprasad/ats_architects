import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Interviewer = sequelize.define('interviewer', {
  Interviewer_ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Recruiter_ID: { type: DataTypes.INTEGER, allowNull: false },
  First_Name: { type: DataTypes.STRING, allowNull: false },
  Last_Name: { type: DataTypes.STRING, allowNull: false },
  Email: { type: DataTypes.STRING, unique: true, allowNull: false },
  Phone_Number: { type: DataTypes.STRING, allowNull: false },
});

export default Interviewer;
