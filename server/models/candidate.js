import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Candidate = sequelize.define("candidate", {
  candidate_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  first_name: { type: DataTypes.STRING, allowNull: false },
  last_name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  phone_number: { type: DataTypes.STRING, allowNull: false }
});


export default Candidate;

