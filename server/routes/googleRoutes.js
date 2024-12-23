import express from 'express';
import { listLabels, getEmails, createMeeting, processIncomingEmail, createEvent } from '../controllers/googleController.js';
import { updateResumeScore } from '../controllers/geminiController.js';

const router = express.Router();

// router.get('/labels', listLabels);
router.get('/emails', getEmails);
// router.post('/calendar-event', createEvent);
router.post('/create-meeting', createMeeting);
router.get('/', processIncomingEmail);
router.get('/update-resume-score', updateResumeScore);

export default router;