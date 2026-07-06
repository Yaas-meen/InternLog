import LogEntry from '../models/LogEntry.model.js';
import User     from '../models/User.model.js';
import { generateWeeklySummary } from './ai.service.js';

//  Weekly report data 
export const getWeeklyReportData = async (internId, weekNumber) => {
  const intern = await User.findById(internId).lean();
  if (!intern) {
    const error = new Error('Intern not found');
    error.statusCode = 404;
    throw error;
  }

  const logs = await LogEntry
    .find({ intern: internId, weekNumber: Number(weekNumber) })
    .sort({ date: 1 })
    .lean();

  const totalHours  = logs.reduce((sum, l) => sum + l.hoursWorked, 0);
  const reviewedCount = logs.filter(l => l.status === 'reviewed').length;

  // Generate AI summary if there are logs
  let aiSummary = null;
  if (logs.length > 0) {
    const result = await generateWeeklySummary(logs);
    aiSummary    = result.success ? result.summary : null;
  }

  return {
    intern: {
      fullName:   `${intern.firstName} ${intern.lastName}`,
      email:      intern.email,
      department: intern.department,
    },
    weekNumber: Number(weekNumber),
    logs,
    summary: {
      totalDays:     logs.length,
      totalHours,
      reviewedCount,
      pendingCount:  logs.length - reviewedCount,
    },
    aiSummary,
    generatedAt: new Date(),
  };
};

//  Monthly report data 
export const getMonthlyReportData = async (internId, month, year) => {
  const intern = await User.findById(internId).lean();
  if (!intern) {
    const error = new Error('Intern not found');
    error.statusCode = 404;
    throw error;
  }

  const startDate = new Date(year, month - 1, 1);
  const endDate   = new Date(year, month, 0, 23, 59, 59);

  const logs = await LogEntry
    .find({
      intern: internId,
      date:   { $gte: startDate, $lte: endDate },
    })
    .sort({ date: 1 })
    .lean();

  const totalHours = logs.reduce((sum, l) => sum + l.hoursWorked, 0);

  // Group logs by week
  const byWeek = logs.reduce((acc, log) => {
    const week = log.weekNumber;
    if (!acc[week]) acc[week] = [];
    acc[week].push(log);
    return acc;
  }, {});

  return {
    intern: {
      fullName:   `${intern.firstName} ${intern.lastName}`,
      email:      intern.email,
      department: intern.department,
    },
    month:  Number(month),
    year:   Number(year),
    logs,
    byWeek,
    summary: {
      totalDays:    logs.length,
      totalHours,
      totalWeeks:   Object.keys(byWeek).length,
      reviewedCount: logs.filter(l => l.status === 'reviewed').length,
    },
    generatedAt: new Date(),
  };
};

//  Admin: get all interns summary 
export const getAdminDashboardData = async () => {
  const interns = await User.find({ role: 'intern' }).lean();

  const summary = await Promise.all(interns.map(async (intern) => {
    const totalLogs    = await LogEntry.countDocuments({ intern: intern._id });
    const pendingLogs  = await LogEntry.countDocuments({ intern: intern._id, status: 'pending' });
    const reviewedLogs = await LogEntry.countDocuments({ intern: intern._id, status: 'reviewed' });
    const totalHoursAgg = await LogEntry.aggregate([
      { $match: { intern: intern._id } },
      { $group: { _id: null, total: { $sum: '$hoursWorked' } } },
    ]);

    return {
      intern: {
        _id:        intern._id,
        fullName:   `${intern.firstName} ${intern.lastName}`,
        email:      intern.email,
        department: intern.department,
      },
      stats: {
        totalLogs,
        pendingLogs,
        reviewedLogs,
        totalHours: totalHoursAgg[0]?.total || 0,
      },
    };
  }));

  return summary;
};