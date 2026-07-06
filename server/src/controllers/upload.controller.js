import asyncHandler           from '../utils/asyncHandler.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { extractTextFromImage } from '../services/ai.service.js';
import LogEntry from '../models/LogEntry.model.js';
import path     from 'path';
import fs       from 'fs';

//  POST /api/v1/upload/logbook 
export const uploadLogbookImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return errorResponse(res, 400, 'No image file provided');
  }

  const filePath = req.file.path;
  const mimeType = req.file.mimetype;
  const imageUrl = `/uploads/${req.file.filename}`;

  // Run OCR extraction
  const ocr = await extractTextFromImage(filePath, mimeType);

  return successResponse(res, 200, 'Image uploaded and processed', {
    imageUrl,
    filename:      req.file.filename,
    originalName:  req.file.originalname,
    size:          req.file.size,
    extractedText: ocr.extractedText,
    ocrSuccess:    ocr.success,
  });
});

//  POST /api/v1/upload/logbook/:logId 
// Attach image to an existing log entry
export const attachImageToLog = asyncHandler(async (req, res) => {
  if (!req.file) {
    return errorResponse(res, 400, 'No image file provided');
  }

  const log = await LogEntry.findById(req.params.logId);

  if (!log) {
    return errorResponse(res, 404, 'Log entry not found');
  }

  if (log.intern.toString() !== req.user._id.toString()) {
    return errorResponse(res, 403, 'Not authorised to update this log');
  }

  const filePath = req.file.path;
  const mimeType = req.file.mimetype;
  const imageUrl = `/uploads/${req.file.filename}`;

  // Delete old image if it exists
  if (log.imageUrl) {
    const oldPath = path.join('uploads', path.basename(log.imageUrl));
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
  }

  // Run OCR
  const ocr = await extractTextFromImage(filePath, mimeType);

  // Update log entry
  log.imageUrl      = imageUrl;
  log.extractedText = ocr.extractedText;
  await log.save({ validateBeforeSave: false });

  return successResponse(res, 200, 'Image attached to log entry', {
    imageUrl,
    extractedText: ocr.extractedText,
    ocrSuccess:    ocr.success,
  });
});