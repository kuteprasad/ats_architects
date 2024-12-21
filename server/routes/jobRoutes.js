import express from 'express';
import { createJob, fetchJobs } from '../controllers/jobController.js';
import { createTable } from '../controllers/jobController.js';

const router = express.Router();

router.post('/', createJob);
router.get('/', fetchJobs);

router.get('/', createTable)

export default router;
