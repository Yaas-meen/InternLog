import asyncHandler from '../utils/asyncHandler.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import {
  registerUser,
  loginUser,
  issueTokens,
  sanitiseUser,
  refreshAccessToken,
  logoutUser,
  getRefreshCookieOptions,
} from '../services/auth.service.js';

//  POST /api/v1/auth/register 
export const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, role, department } = req.body;

  const user        = await registerUser({ firstName, lastName, email, password, role, department });
  const accessToken = await issueTokens(user, res);

  return successResponse(res, 201, 'Account created successfully', {
    accessToken,
    user: sanitiseUser(user),
  });
});

//  POST /api/v1/auth/login 
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user        = await loginUser(email, password);
  const accessToken = await issueTokens(user, res);

  return successResponse(res, 200, 'Login successful', {
    accessToken,
    user: sanitiseUser(user),
  });
});

//  POST /api/v1/auth/refresh 
export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;

  const { user, newAccessToken } = await refreshAccessToken(token);

  return successResponse(res, 200, 'Token refreshed', {
    accessToken: newAccessToken,
    user:        sanitiseUser(user),
  });
});

//  POST /api/v1/auth/logout 
export const logout = asyncHandler(async (req, res) => {
  const token  = req.cookies?.refreshToken;
  const isProd = process.env.NODE_ENV === 'production';

  await logoutUser(token);

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure:   isProd,
    sameSite: isProd ? 'none' : 'lax',
  });

  return successResponse(res, 200, 'Logged out successfully');
});

//  GET /api/v1/auth/me 
export const getMe = asyncHandler(async (req, res) => {
  return successResponse(res, 200, 'User retrieved', sanitiseUser(req.user));
});