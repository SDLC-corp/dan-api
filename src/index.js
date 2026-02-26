/* eslint-disable no-console */
const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');

let server;

const connectDBAndStart = async () => {
  try {
    await mongoose.connect(config.mongoose.url, config.mongoose.options);
    logger.info('Connected to MongoDB');

    server = app.listen(config.port, () => {
      logger.info(`Listening to port ${config.port}`);
    });
  } catch (err) {
    logger.error('Failed to connect to MongoDB');
    logger.error(err);
    process.exit(1);
  }
};

const shutdown = async (signal) => {
  try {
    logger.info(`${signal} received. Shutting down...`);
    if (server) {
      await new Promise((resolve) => server.close(resolve));
      logger.info('HTTP server closed');
    }
    await mongoose.connection.close(false);
    logger.info('Mongo connection closed');
    process.exit(0);
  } catch (err) {
    logger.error('Shutdown error');
    logger.error(err);
    process.exit(1);
  }
};

process.on('uncaughtException', (error) => {
  logger.error('uncaughtException');
  logger.error(error);
  shutdown('uncaughtException');
});

process.on('unhandledRejection', (error) => {
  logger.error('unhandledRejection');
  logger.error(error);
  shutdown('unhandledRejection');
});

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

connectDBAndStart();