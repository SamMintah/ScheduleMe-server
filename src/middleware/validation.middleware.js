import { body, param, validationResult } from 'express-validator';
import logger from '../config/logger.js';

export const validateMeetingCreation = [
  body('startTime').isISO8601().withMessage('Invalid start time format'),
  body('duration').isInt({ min: 15, max: 180 }).withMessage('Duration must be between 15 and 180 minutes'),
  body('participants').isArray({ min: 2, max: 2 }).withMessage('Exactly 2 participants required'),
  body('title').trim().notEmpty().withMessage('Title is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Validation failed:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
