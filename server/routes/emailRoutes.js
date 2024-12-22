import express from 'express';
import { processIncomingEmail } from '../controllers/emailController.js';

const router = express.Router();

router.get('/', processIncomingEmail);

export default router;
