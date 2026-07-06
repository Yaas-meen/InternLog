import mongoose from 'mongoose';

const logEntrySchema = new mongoose.Schema({
  intern: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'User',
    required: [true, 'Intern reference is required'],
  },
  date: {
    type:     Date,
    required: [true, 'Date is required'],
  },
  weekNumber: {
    type:     Number,
    required: [true, 'Week number is required'],
    min:      [1, 'Week number must be at least 1'],
    max:      [52, 'Week number cannot exceed 52'],
  },
  dayOfWeek: {
    type:     String,
    required: [true, 'Day of week is required'],
    enum:     ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  },
  tasksCompleted: {
    type:      String,
    required:  [true, 'Tasks completed is required'],
    trim:      true,
    minlength: [10, 'Please describe your tasks in at least 10 characters'],
  },
  hoursWorked: {
    type:    Number,
    required:[true, 'Hours worked is required'],
    min:     [1, 'Minimum 1 hour'],
    max:     [12, 'Maximum 12 hours per day'],
  },
  status: {
    type:    String,
    enum:    ['pending', 'reviewed'],
    default: 'pending',
  },
  supervisorRemarks: {
    type:    String,
    trim:    true,
    default: '',
  },
  imageUrl: {
    type:    String,
    default: null,
  },
  extractedText: {
    type:    String,
    default: null,
  },
}, { timestamps: true });

//  one log per intern per day 
logEntrySchema.index({ intern: 1, date: 1 }, { unique: true });

logEntrySchema.statics.getWeekNumber = function (date) {
  const d    = new Date(date);
  const start = new Date(d.getFullYear(), 0, 1);
  const diff  = d - start;
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  return Math.ceil((diff / oneWeek) + start.getDay() / 7);
};

export default mongoose.model('LogEntry', logEntrySchema);