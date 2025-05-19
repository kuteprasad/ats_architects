import express from 'express';
import { getCandidates } from '../controllers/candidateController.js';

const router = express.Router();

router.get('/', getCandidates);

export default router;
