import express from 'express';
import { fetchInterviewsByInterviewerId, addFeedback } from '../controllers/interviewerController.js';


const router = express.Router();


router.get('/interviewer/:interviewerId', fetchInterviewsByInterviewerId);
router.post('/feedback', addFeedback);

export default router;
