import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { authService } from '../services/authService.js';
import  Candidate  from '../models/candidate.js';
import Recruiter from '../models/recruiter.js'

// Registration controller
export const register = async (req, res) => {
  const { firstName, lastName, email, password, phoneNumber, role } = req.body;
  console.log("body: ", req.body);

  try {
    // Check if user already exists
    const existingUser = await Candidate.findOne({ where: { Email: email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    if(role === 'candidate'){
      const newUser = await Candidate.create({
        First_Name: firstName,
        Last_Name: lastName,
        Email: email,
        Phone_Number: phoneNumber,
        Password: hashedPassword
      });
    }
    else{
      const newUser = await Recruiter.create({
        First_Name: firstName,
        Last_Name: lastName,
        Email: email,
        Phone_Number: phoneNumber,
        Password: hashedPassword,
      });
    }

    // Create a new user

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
    // Find user by email
    const user = await Candidate.findOne({ where: { Email: email } });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.Password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = authService.generateToken(user);

    return res.status(200).json({ message: 'Login successful', token, user });
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
