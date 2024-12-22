import express from 'express';
import { fetchInterviewsByInterviewerId, addFeedback, addSchedules } from '../controllers/interviewerController.js';


const router = express.Router();


router.get('/interviewer/:interviewerId', fetchInterviewsByInterviewerId);
router.post('/feedback', addFeedback);
router.post('/schedule', addSchedules);

export default router;
