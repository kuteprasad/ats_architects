import express from 'express';
import { createApplication, getApplicationsByJobId } from '../controllers/applicationController.js';
import multer from 'multer';


const router = express.Router();


router.get('/:jobId', getApplicationsByJobId);

const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || 
        file.mimetype === 'application/msword' || 
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .pdf, .doc and .docx formats allowed!'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

router.post('/:jobId', upload.single('resume'), createApplication);

export default router;
