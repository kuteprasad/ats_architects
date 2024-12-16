import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Recruiter = sequelize.define('recruiter', {
  Recruiter_ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Email: { type: DataTypes.STRING, allowNull: false, unique: true },
  Company_Name: { type: DataTypes.STRING, allowNull: false },
  Phone_Number: { type: DataTypes.STRING, allowNull: false },
});

export default Recruiter;
