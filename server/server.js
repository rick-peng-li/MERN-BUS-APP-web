import app from './app.js';
import { connectDatabase, disconnectDatabase } from './config/db.js';
import { env } from './config/env.js';

const start = async () => {
  await connectDatabase();

  const server = app.listen(env.port, () => {
    console.log(`[server] Unique Travels API ready on http://localhost:${env.port}/api`);
  });

  const shutdown = async signal => {
    console.log(`\n[server] ${signal} received, shutting down`);
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
};

start().catch(error => {
  console.error('[server] failed to start:', error);
  process.exit(1);
});
