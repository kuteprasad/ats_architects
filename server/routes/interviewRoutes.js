import express from 'express';
import { 
  fetchInterviewsByInterviewerId, 
  addSchedules, 
  addFeedback,
  changeApplicationStatusToAccepted,
  changeApplicationStatusToRejected 
} from '../controllers/interviewerController.js';

const router = express.Router();

router.get('/interviewer/:interviewerId', fetchInterviewsByInterviewerId);
router.post('/feedback', addFeedback);
router.post('/schedule', addSchedules);
router.patch('/applications/:applicationId/accept', changeApplicationStatusToAccepted);
router.patch('/applications/:applicationId/reject', changeApplicationStatusToRejected);

export default router;
