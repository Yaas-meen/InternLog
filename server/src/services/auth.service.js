import jwt  from 'jsonwebtoken';
import User from '../models/User.model.js';

//  Token generation 
export const generateAccessToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

export const generateRefreshToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
  );
};

//  Cookie config 
export const getRefreshCookieOptions = () => {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure:   isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge:   7 * 24 * 60 * 60 * 1000,
  };
};

//  Issue tokens and set cookie 
export const issueTokens = async (user, res) => {
  const accessToken  = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id, user.role);

  // Store refresh token in DB
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  // Set refresh token as httpOnly cookie
  res.cookie('refreshToken', refreshToken, getRefreshCookieOptions());

  return accessToken;
};

//  Sanitise user object 
export const sanitiseUser = (user) => ({
  _id:        user._id,
  firstName:  user.firstName,
  lastName:   user.lastName,
  fullName:   user.fullName,
  email:      user.email,
  role:       user.role,
  department: user.department,
  createdAt:  user.createdAt,
});

//  Register 
export const registerUser = async ({ firstName, lastName, email, password, role, department }) => {
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    const error  = new Error('An account with this email already exists');
    error.statusCode = 409;
    throw error;
  }

  const user = await User.create({
    firstName,
    lastName,
    email: email.toLowerCase(),
    password,
    role:       role       || 'intern',
    department: department || '',
  });

  return user;
};

//  Login 
export const loginUser = async (email, password) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  return user;
};

//  Refresh token 
export const refreshAccessToken = async (token) => {
  if (!token) {
    const error = new Error('No refresh token provided');
    error.statusCode = 401;
    throw error;
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch {
    const error = new Error('Invalid or expired refresh token');
    error.statusCode = 401;
    throw error;
  }

  const user = await User.findById(decoded.id).select('+refreshToken');

  if (!user || user.refreshToken !== token) {
    const error = new Error('Refresh token has been revoked');
    error.statusCode = 401;
    throw error;
  }

  const newAccessToken = generateAccessToken(user._id, user.role);
  return { user, newAccessToken };
};

//  Logout 
export const logoutUser = async (token) => {
  if (!token) return;

  try {
    const decoded = jwt.decode(token);
    if (decoded?.id) {
      await User.findByIdAndUpdate(decoded.id, { refreshToken: null });
    }
  } catch {
    // silently fail — logout should always succeed
  }
};