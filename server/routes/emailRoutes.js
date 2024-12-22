import express from 'express';
import { processIncomingEmail } from '../controllers/emailController.js';

const router = express.Router();

router.post('/process', processIncomingEmail);

export default router;