import express from 'express';
import { createJob, fetchJobs } from '../controllers/jobController.js';
import { fetchJob } from '../controllers/jobController.js'; // Assuming you have a function to fetch a specific job

const router = express.Router();

router.post('/', createJob);
router.get('/', fetchJobs);
router.get(`/:jobId`, fetchJob); // Assuming you want to fetch a specific job by ID


export default router;
