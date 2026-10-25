import 'dotenv/config';

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 8080,
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bus_app',
  jwtSecret: process.env.JWT_SECRET || 'unique-travels-development-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173'
};

export const isProduction = env.nodeEnv === 'production';
