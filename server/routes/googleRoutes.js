import express from 'express';
import { listLabels, getEmails, createMeeting, processIncomingEmail, createEvent } from '../controllers/googleController.js';

const router = express.Router();

// router.get('/labels', listLabels);
router.get('/emails', getEmails);
// router.post('/calendar-event', createEvent);
router.post('/create-meeting', createMeeting);
router.post('/process-email', processIncomingEmail);

export default router;