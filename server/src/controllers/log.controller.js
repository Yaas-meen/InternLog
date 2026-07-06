import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/apiResponse.js';
import {
  createLog,
  getMyLogs,
  getLogById,
  updateLog,
  deleteLog,
  getAllLogs,
  reviewLog,
  getLogsByWeek,
} from '../services/log.service.js';

//  POST /api/v1/logs 
export const create = asyncHandler(async (req, res) => {
  const log = await createLog(req.user._id, req.body);
  return successResponse(res, 201, 'Log entry created successfully', log);
});

//  GET /api/v1/logs/my 
export const getMy = asyncHandler(async (req, res) => {
  const logs = await getMyLogs(req.user._id, req.query);
  return successResponse(res, 200, 'Logs retrieved', logs);
});

//  GET /api/v1/logs/:id 
export const getOne = asyncHandler(async (req, res) => {
  const log = await getLogById(req.params.id, req.user._id, req.user.role);
  return successResponse(res, 200, 'Log entry retrieved', log);
});

//  PATCH /api/v1/logs/:id 
export const update = asyncHandler(async (req, res) => {
  const log = await updateLog(req.params.id, req.user._id, req.body);
  return successResponse(res, 200, 'Log entry updated', log);
});

//  DELETE /api/v1/logs/:id 
export const remove = asyncHandler(async (req, res) => {
  await deleteLog(req.params.id, req.user._id);
  return successResponse(res, 200, 'Log entry deleted');
});

//  GET /api/v1/logs/admin/all 
export const getAll = asyncHandler(async (req, res) => {
  const logs = await getAllLogs(req.query);
  return successResponse(res, 200, 'All logs retrieved', logs);
});

//  PATCH /api/v1/logs/admin/:id/review 
export const review = asyncHandler(async (req, res) => {
  const log = await reviewLog(req.params.id, req.body);
  return successResponse(res, 200, 'Log reviewed successfully', log);
});

//  GET /api/v1/logs/week/:weekNumber 
export const getWeek = asyncHandler(async (req, res) => {
  const logs = await getLogsByWeek(req.user._id, req.params.weekNumber);
  return successResponse(res, 200, `Week ${req.params.weekNumber} logs retrieved`, logs);
});