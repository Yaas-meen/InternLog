import express from 'express';
import { protect }   from '../middlewares/auth.middleware.js';
import { validate }  from '../middlewares/validate.middleware.js';
import { registerSchema, loginSchema } from '../validators/auth.validator.js';
import { register, login, refresh, logout, getMe } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login',    validate(loginSchema),    login);
router.post('/refresh',  refresh);
router.post('/logout',   logout);
router.get('/me',        protect, getMe);

export default router;