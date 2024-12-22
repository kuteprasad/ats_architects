import express from 'express';
import { createMeeting } from '../integrations/gmeetIntegration.js';

const router = express.Router();

router.post('/create-meeting', async (req, res) => {
  try {
    const { startDateTime, endDateTime, summary } = req.body;
    const meeting = await createMeeting({ startDateTime, endDateTime, summary });
    res.status(200).json(meeting);
  } catch (error) {
    console.error('Error creating meeting:', error);
    res.status(500).json({ success: false, message: 'Failed to create meeting', error: error.message });
  }
});

export default router;