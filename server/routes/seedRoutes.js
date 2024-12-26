import express from 'express';
import { createTables, deleteTables, insertValues } from '../scripts/seedDatabase.js';

const router = express.Router();

router.get('/insert', insertValues);
router.get('/delete', deleteTables);
router.get('/create', createTables);

export default router;