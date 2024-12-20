import express from 'express';
import createJob from '../controllers/jobController.js';

const router = express.Router();

router.post('/jobs', createJob);

export default router;
