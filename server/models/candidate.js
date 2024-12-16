import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Candidate = sequelize.define('candidate', {
  Candidate_ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  First_Name: { type: DataTypes.STRING, allowNull: false },
  Last_Name: { type: DataTypes.STRING, allowNull: false },
  Email: { type: DataTypes.STRING, unique: true, allowNull: false },
  Phone_Number: { type: DataTypes.STRING, allowNull: false },
});


export default Candidate;

