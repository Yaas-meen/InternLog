import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import asyncHandler from '../utils/asyncHandler.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import User from '../models/User.model.js';

const router = express.Router();

// PATCH /api/v1/users/profile
router.patch('/profile', protect, asyncHandler(async (req, res) => {
  const { firstName, lastName, department } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { firstName, lastName, department } },
    { new: true, runValidators: true }
  );
  return successResponse(res, 200, 'Profile updated', {
    firstName:  user.firstName,
    lastName:   user.lastName,
    department: user.department,
  });
}));

// PATCH /api/v1/users/password
router.patch('/password', protect, asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return errorResponse(res, 400, 'Both current and new password are required');
  }

  const user = await User.findById(req.user._id).select('+password');
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    return errorResponse(res, 401, 'Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();

  return successResponse(res, 200, 'Password changed successfully');
}));

export default router;