import express from 'express';
import { monthlyApplication, jobPostingVsApplication, jobPostingsVsMonth, statusApplicationBreakdown} from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/applications-monthly', monthlyApplication);
router.get('/top-job-postings', jobPostingVsApplication);
router.get('/job-postings-monthly', jobPostingsVsMonth);
router.get('/application-status-breakdown', statusApplicationBreakdown);


export default router;