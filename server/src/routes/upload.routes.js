import express from 'express';
import { protect, authorize } from '../middlewares/auth.middleware.js';
import { upload }             from '../config/multer.config.js';
import { uploadLogbookImage, attachImageToLog } from '../controllers/upload.controller.js';

const router = express.Router();

// Upload and OCR an image (returns extracted text, no log needed yet)
router.post(
  '/logbook',
  protect,
  authorize('intern'),
  upload.single('image'),
  uploadLogbookImage
);

// Upload image and attach it to an existing log entry
router.post(
  '/logbook/:logId',
  protect,
  authorize('intern'),
  upload.single('image'),
  attachImageToLog
);

export default router;