import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import { authService } from '../services/authService.js';

// Registration controller
export const register = async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  try {
    // Check if user already exists
    const existingUserQuery = 'SELECT * FROM users WHERE email = $1';
    const existingUserResult = await pool.query(existingUserQuery, [email]);

    if (existingUserResult.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const insertUserQuery = `
      INSERT INTO users ("firstName", "lastName", "email", password, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const newUserResult = await pool.query(insertUserQuery, [firstName, lastName, email, hashedPassword, role]);
    const newUser = newUserResult.rows[0];

    console.log("new user: ", newUser);

    // Generate JWT token
    const token = authService.generateToken(newUser);

    return res.status(201).json({ message: 'User created successfully', token, user: newUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Login controller
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {

    console.log("reached to login, ", email, password);
    // Find user by email
    const userQuery = 'SELECT * FROM users WHERE email = $1';
    const userResult = await pool.query(userQuery, [email]);
    const user = userResult.rows[0];
    console.log("user: ", user);

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = authService.generateToken(user);

    return res.status(200).json({ message: 'Login successful', token, user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


export const getInterviewers = async (req, res) => {
  try {
    const query = `
      SELECT 
        "userId",
        "firstName",
        "lastName",
        email
      FROM users 
      WHERE role = 'interviewer'
    `;

    const result = await pool.query(query);

    const interviewers = result.rows.map(interviewer => ({
      id: interviewer.userId,
      name: `${interviewer.firstName} ${interviewer.lastName}`,
      email: interviewer.email,
      role: interviewer.role
    }));

    res.status(200).json({
      success: true,
      interviewers: interviewers
    });

  } catch (error) {
    console.error('Error fetching interviewers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch interviewers',
      error: error.message
    });
  }
};