import { z } from 'zod';
import { errorResponse } from '../utils/apiResponse.js';

export const createLogSchema = z.object({
  date: z
    .string({ required_error: 'Date is required' })
    .refine(val => !isNaN(Date.parse(val)), { message: 'Invalid date format' }),

  weekNumber: z
    .number({ required_error: 'Week number is required' })
    .int()
    .min(1, 'Week number must be at least 1')
    .max(52, 'Week number cannot exceed 52'),

  dayOfWeek: z.enum(
    ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    { required_error: 'Day of week is required' }
  ),

  tasksCompleted: z
    .string({ required_error: 'Tasks completed is required' })
    .min(10, 'Please describe your tasks in at least 10 characters'),

  hoursWorked: z
    .number({ required_error: 'Hours worked is required' })
    .min(1, 'Minimum 1 hour')
    .max(12, 'Maximum 12 hours per day'),
});

export const updateLogSchema = z.object({
  tasksCompleted: z
    .string()
    .min(10, 'Please describe your tasks in at least 10 characters')
    .optional(),

  hoursWorked: z
    .number()
    .min(1, 'Minimum 1 hour')
    .max(12, 'Maximum 12 hours per day')
    .optional(),

  weekNumber: z
    .number()
    .int()
    .min(1)
    .max(52)
    .optional(),

  dayOfWeek: z
    .enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'])
    .optional(),
});

export const reviewLogSchema = z.object({
  supervisorRemarks: z
    .string({ required_error: 'Remarks are required when reviewing' })
    .min(5, 'Remarks must be at least 5 characters'),

  status: z.enum(['pending', 'reviewed'], {
    required_error: 'Status must be pending or reviewed',
  }),
});

export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    const errorMessages = error.errors.map((err) => err.message).join(', ');
    return errorResponse(res, 400, `Validation Failed: ${errorMessages}`);
  }
};

export const validateLog = (req, res, next) => {
  try {
    createLogSchema.parse(req.body);
    next();
  } catch (error) {
    const errorMessages = error.errors.map((err) => err.message).join(', ');
    return res.status(400).json({
      success: false,
      message: `Validation Failed: ${errorMessages}`
    });
  }
};