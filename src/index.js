/* eslint-disable no-console */
const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const startDocumentExtractionRunner = require('./modules/documents/services/document_runner');

let server;
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');
  server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
    // logger.info(`START_FIELDS_EXTRACTION_PROCESS`, process.env.START_FIELDS_EXTRACTION_PROCESS);

    /* START_FIELDS_EXTRACTION_PROCESS */
    // if(process.env.START_FIELDS_EXTRACTION_PROCESS){
    //   startDocumentExtractionRunner()
    // }
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});