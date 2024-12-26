import express from 'express';
import { getEmails, createMeeting, processEmails, sendEmails } from '../controllers/googleController.js';
import { updateResumeScore } from '../controllers/geminiController.js';

const router = express.Router();

router.get('/emails', getEmails);
router.post('/create-meeting', createMeeting);
router.get('/process-emails', processEmails);
router.get('/update-resume-score', updateResumeScore);
router.post('/send-emails', sendEmails);

export default router;