import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Application = sequelize.define('application', {
  Application_ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Candidate_ID: { type: DataTypes.INTEGER, allowNull: false },
  Job_Posting_ID: { type: DataTypes.INTEGER, allowNull: false },
  Application_Date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  Application_Status: { type: DataTypes.STRING, allowNull: false },
  Interview_Schedule: { type: DataTypes.DATE, allowNull: true },
  Resume: { type: DataTypes.BLOB, allowNull: true },
  Resume_Score: { type: DataTypes.DECIMAL, allowNull: true },
});

export default Application;
