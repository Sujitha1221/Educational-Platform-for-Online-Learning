const fs = require('fs');
const pino = require('pino');

// Create a write stream to log to a file
const logStream = fs.createWriteStream('app.log');

// Configure Pino with custom options
const logger = pino({
  level: 'info', // Set logging level to 'info' by default
  base: null, // Do not include any default properties
  timestamp: pino.stdTimeFunctions.isoTime, // Include ISO-formatted timestamps
  serializers: {
    req: pino.stdSerializers.req, // Serialize HTTP request objects
    res: pino.stdSerializers.res, // Serialize HTTP response objects
    err: pino.stdSerializers.err, // Serialize error objects
  },
}, logStream);

// Enhance logger with additional log levels
logger.trace = logger.trace.bind(logger);
logger.debug = logger.debug.bind(logger);
logger.info = logger.info.bind(logger);
logger.warn = logger.warn.bind(logger);
logger.error = logger.error.bind(logger);
logger.fatal = logger.fatal.bind(logger);

// Export the configured logger
module.exports = logger;
