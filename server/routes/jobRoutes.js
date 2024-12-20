import express from 'express';
import { createJob, fetchJobs } from '../controllers/jobController.js';

const router = express.Router();

// POST /auth/register
router.post('/', createJob);
router.get('/', fetchJobs);



export default router;
