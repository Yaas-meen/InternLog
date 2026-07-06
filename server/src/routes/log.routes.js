import express from 'express';
import { protect, authorize } from '../middlewares/auth.middleware.js';
import { validate }           from '../middlewares/validate.middleware.js';
import {
  createLogSchema,
  updateLogSchema,
  reviewLogSchema,
  validateLog,
} from '../validators/log.validator.js';
import {
  create,
  getMy,
  getOne,
  update,
  remove,
  getAll,
  review,
  getWeek,
} from '../controllers/log.controller.js';

const router = express.Router();

//  Intern routes 
router.post('/',                protect, authorize('intern'), validate(createLogSchema), create);
router.get('/my',               protect, authorize('intern'), getMy);
router.get('/week/:weekNumber', protect, authorize('intern'), getWeek);
router.get('/:id',              protect, getOne);
router.patch('/:id',            protect, authorize('intern'), validate(updateLogSchema), update);
router.delete('/:id',           protect, authorize('intern'), remove);

//  Admin routes 
router.get('/admin/all',             protect, authorize('admin'), getAll);
router.patch('/admin/:id/review',    protect, authorize('admin'), validate(reviewLogSchema), review);

export default router;