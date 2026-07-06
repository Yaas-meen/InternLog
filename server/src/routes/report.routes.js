import express from 'express';
import { protect, authorize } from '../middlewares/auth.middleware.js';
import {
  weeklyReport,
  monthlyReport,
  adminDashboard,
  adminInternWeekly,
} from '../controllers/report.controller.js';

const router = express.Router();

// Intern routes
router.get('/weekly/:weekNumber',        protect, authorize('intern'), weeklyReport);
router.get('/monthly/:month/:year',      protect, authorize('intern'), monthlyReport);

// Admin routes
router.get('/admin/dashboard',           protect, authorize('admin'), adminDashboard);
router.get('/admin/intern/:internId/weekly/:weekNumber', protect, authorize('admin'), adminInternWeekly);

export default router;