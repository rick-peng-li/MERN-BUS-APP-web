import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';

const extractToken = req => {
  const header = req.headers.authorization || '';
  if (header.startsWith('Bearer ')) {
    return header.slice(7).trim();
  }
  return null;
};

export const requireAuth = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) {
      throw ApiError.unauthorized('Missing authentication token');
    }

    const payload = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(payload.sub);
    if (!user) {
      throw ApiError.unauthorized('This account no longer exists');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
      return next(ApiError.unauthorized('Invalid or expired token'));
    }
    next(error);
  }
};
