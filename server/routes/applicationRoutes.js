import express from 'express';
import { createApplication, getApplicationsByJobId } from '../controllers/applicationController.js';


const router = express.Router();


router.get('/:jobId', getApplicationsByJobId);

router.post('/:jobId', createApplication);



export default router;
