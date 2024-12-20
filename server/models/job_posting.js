import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const JobPosting = sequelize.define('job_posting', {
  Job_Posting_ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Job_Title: { type: DataTypes.STRING, allowNull: false },
  Job_Description: { type: DataTypes.TEXT, allowNull: false },
  Location: { type: DataTypes.STRING, allowNull: false },
  Salary_Range: { type: DataTypes.STRING, allowNull: true },
  Posting_Date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  endDate: { type: DataTypes.STRING, allowNull: false },
  Job_Requirements: { type: DataTypes.TEXT, allowNull: false },
});

export default JobPosting;
