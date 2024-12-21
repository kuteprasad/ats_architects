import express from 'express';
import { register, login, getInterviewers } from '../controllers/authController.js';

const router = express.Router();

// POST /auth/register
router.post('/register', register);

// POST /auth/login
router.post('/login', login);

router.get('/interviewers', getInterviewers);

export default router;
