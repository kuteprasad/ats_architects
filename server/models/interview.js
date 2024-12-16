import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Interview = sequelize.define('interview', {
  Interview_ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Candidate_ID: { type: DataTypes.INTEGER, allowNull: false },
  Job_Posting_ID: { type: DataTypes.INTEGER, allowNull: false },
  Interviewer_ID: { type: DataTypes.INTEGER, allowNull: false },
  Interview_Date: { type: DataTypes.DATE, allowNull: false },
  Interview_Type: { type: DataTypes.STRING, allowNull: false },
  Interview_Result: { type: DataTypes.STRING, allowNull: true },
  Feedback: { type: DataTypes.TEXT, allowNull: true },
});

export default Interview;
