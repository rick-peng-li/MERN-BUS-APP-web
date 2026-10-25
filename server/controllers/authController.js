import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';

const signToken = user =>
  jwt.sign({ sub: user._id.toString(), email: user.email }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn
  });

export const register = async (req, res) => {
  const { name, email, password, mobile, gender, dob } = req.body;

  if (!name || !email || !password || !mobile || !gender) {
    throw ApiError.badRequest('Name, email, password, mobile and gender are required');
  }

  if (String(password).length < 6) {
    throw ApiError.badRequest('Password must be at least 6 characters long');
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw ApiError.conflict('This email is already registered');
  }

  const hashedPassword = await bcrypt.hash(String(password), 10);
  const user = await User.create({
    name,
    email: normalizedEmail,
    password: hashedPassword,
    mobile,
    gender,
    dob: dob ? new Date(dob) : undefined
  });

  res.status(201).json({ user: user.toPublicJSON() });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw ApiError.badRequest('Email and password are required');
  }

  const user = await User.findOne({ email: String(email).trim().toLowerCase() }).select('+password');
  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(String(password), user.password);
  if (!isMatch) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  res.json({ token: signToken(user), user: user.toPublicJSON() });
};

export const me = async (req, res) => {
  res.json({ user: req.user.toPublicJSON() });
};
