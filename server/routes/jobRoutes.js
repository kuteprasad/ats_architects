import express from 'express';
import { createJob } from '../controllers/jobController';

const router = express.Router();

// POST /auth/register
router.post('/jobs', createJob);

export default router;
