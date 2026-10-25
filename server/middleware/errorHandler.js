import mongoose from 'mongoose';
import { isProduction } from '../config/env.js';

export const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal server error';

  if (error instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = Object.values(error.errors)
      .map(item => item.message)
      .join(', ');
  } else if (error instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = 'Invalid identifier supplied';
  } else if (error.code === 11000) {
    statusCode = 409;
    message = 'This record already exists';
  }

  if (statusCode >= 500 && isProduction) {
    message = 'Internal server error';
  }

  if (statusCode >= 500) {
    console.error('[error]', error);
  }

  res.status(statusCode).json({
    message,
    ...(error.details ? { details: error.details } : {})
  });
};
