import LogEntry from '../models/LogEntry.model.js';

//create a new log entry 
export const createLog = async (internId, data) => {
  const existing = await LogEntry.findOne({
    intern: internId,
    date:   new Date(data.date),
  });

  if (existing) {
    const error = new Error('You have already submitted a log for this date');
    error.statusCode = 409;
    throw error;
  }

  const log = await LogEntry.create({
    intern:         internId,
    date:           new Date(data.date),
    weekNumber:     data.weekNumber,
    dayOfWeek:      data.dayOfWeek,
    tasksCompleted: data.tasksCompleted,
    hoursWorked:    data.hoursWorked,
  });

  return log;
};

//get all logs for the logged in intern 
export const getMyLogs = async (internId, query = {}) => {
  const filter = { intern: internId };

  if (query.weekNumber) {
    filter.weekNumber = Number(query.weekNumber);
  }

  if (query.status) {
    filter.status = query.status;
  }

  const logs = await LogEntry
    .find(filter)
    .sort({ date: -1 })
    .lean();

  return logs;
};

//get a single log by ID 
export const getLogById = async (logId, internId, role) => {
  const log = await LogEntry.findById(logId).populate('intern', 'firstName lastName email department');

  if (!log) {
    const error = new Error('Log entry not found');
    error.statusCode = 404;
    throw error;
  }

  //interns can only view their own logs
  if (role === 'intern' && log.intern._id.toString() !== internId.toString()) {
    const error = new Error('Not authorised to view this log');
    error.statusCode = 403;
    throw error;
  }

  return log;
};

//  update a log,only pending logs
export const updateLog = async (logId, internId, data) => {
  const log = await LogEntry.findById(logId);

  if (!log) {
    const error = new Error('Log entry not found');
    error.statusCode = 404;
    throw error;
  }

  if (log.intern.toString() !== internId.toString()) {
    const error = new Error('Not authorised to edit this log');
    error.statusCode = 403;
    throw error;
  }

  if (log.status === 'reviewed') {
    const error = new Error('Cannot edit a log that has already been reviewed');
    error.statusCode = 400;
    throw error;
  }

  const updated = await LogEntry.findByIdAndUpdate(
    logId,
    { $set: data },
    { new: true, runValidators: true }
  );

  return updated;
};

//delete a log (intern only, pending only) 
export const deleteLog = async (logId, internId) => {
  const log = await LogEntry.findById(logId);

  if (!log) {
    const error = new Error('Log entry not found');
    error.statusCode = 404;
    throw error;
  }

  if (log.intern.toString() !== internId.toString()) {
    const error = new Error('Not authorised to delete this log');
    error.statusCode = 403;
    throw error;
  }

  if (log.status === 'reviewed') {
    const error = new Error('Cannot delete a reviewed log entry');
    error.statusCode = 400;
    throw error;
  }

  await log.deleteOne();
};

//admin: get all logs (with optional filters) 
export const getAllLogs = async (query = {}) => {
  const filter = {};

  if (query.internId)   filter.intern     = query.internId;
  if (query.weekNumber) filter.weekNumber = Number(query.weekNumber);
  if (query.status)     filter.status     = query.status;

  const logs = await LogEntry
    .find(filter)
    .populate('intern', 'firstName lastName email department')
    .sort({ date: -1 })
    .lean();

  return logs;
};

//admin: review a log 
export const reviewLog = async (logId, data) => {
  const log = await LogEntry.findById(logId);

  if (!log) {
    const error = new Error('Log entry not found');
    error.statusCode = 404;
    throw error;
  }

  const updated = await LogEntry.findByIdAndUpdate(
    logId,
    {
      $set: {
        status:            data.status,
        supervisorRemarks: data.supervisorRemarks,
      },
    },
    { new: true, runValidators: true }
  ).populate('intern', 'firstName lastName email department');

  return updated;
};

//get logs grouped by week (for reports) 
export const getLogsByWeek = async (internId, weekNumber) => {
  const logs = await LogEntry
    .find({ intern: internId, weekNumber: Number(weekNumber) })
    .sort({ date: 1 })
    .lean();

  return logs;
};