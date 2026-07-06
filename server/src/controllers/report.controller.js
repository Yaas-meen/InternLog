import asyncHandler from '../utils/asyncHandler.js';
import { successResponse } from '../utils/apiResponse.js';
import {
  getWeeklyReportData,
  getMonthlyReportData,
  getAdminDashboardData,
} from '../services/report.service.js';

//  GET /api/v1/reports/weekly/:weekNumber 
export const weeklyReport = asyncHandler(async (req, res) => {
  const data = await getWeeklyReportData(req.user._id, req.params.weekNumber);
  return successResponse(res, 200, 'Weekly report data retrieved', data);
});

//  GET /api/v1/reports/monthly/:month/:year 
export const monthlyReport = asyncHandler(async (req, res) => {
  const data = await getMonthlyReportData(
    req.user._id,
    req.params.month,
    req.params.year
  );
  return successResponse(res, 200, 'Monthly report data retrieved', data);
});

//  GET /api/v1/reports/admin/dashboard 
export const adminDashboard = asyncHandler(async (req, res) => {
  const data = await getAdminDashboardData();
  return successResponse(res, 200, 'Admin dashboard data retrieved', data);
});

//  GET /api/v1/reports/admin/intern/:internId/weekly/:weekNumber
export const adminInternWeekly = asyncHandler(async (req, res) => {
  const data = await getWeeklyReportData(
    req.params.internId,
    req.params.weekNumber
  );
  return successResponse(res, 200, 'Intern weekly report retrieved', data);
});