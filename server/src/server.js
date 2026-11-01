import app from './app.js';
import { env } from './config/env.js';
import { connectDatabase } from './config/database.js';

const startServer = async () => {
  await connectDatabase();
  const server = app.listen(env.PORT, () => {
    console.info(`SocietyVault API listening on port ${env.PORT}`);
  });

  const shutdown = (signal) => {
    console.info(`${signal} received; closing server.`);
    server.close(async (error) => {
      if (error) {
        console.error('HTTP server shutdown failed:', error);
        process.exitCode = 1;
      }
      const mongoose = await import('mongoose');
      await mongoose.default.disconnect();
    });
  };

  process.once('SIGINT', () => shutdown('SIGINT'));
  process.once('SIGTERM', () => shutdown('SIGTERM'));
};

startServer().catch((error) => {
  console.error('Could not start SocietyVault API:', error);
  process.exitCode = 1;
});
