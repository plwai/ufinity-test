const winston = require('winston');

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      level: 'info',
      filename: './logs/info/info.log',
      handleExceptions: true,
      json: true,
      maxsize: 5242880,
      maxFiles: 10,
      colorize: false,
    }),
    new winston.transports.File({
      level: 'error',
      filename: './logs/error/error.log',
      handleExceptions: true,
      json: true,
      maxsize: 5242880,
      maxFiles: 10,
      colorize: false,
    }),
    new winston.transports.File({
      level: 'warn',
      filename: './logs/warn/warn.log',
      handleExceptions: true,
      json: true,
      maxsize: 5242880,
      maxFiles: 10,
      colorize: false,
    }),
  ],
  exitOnError: false,
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

if (process.env.DEBUG_ENV === 'debug') {
  logger.add(
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true,
    })
  );
}

if (process.env.NODE_ENV === 'test') {
  logger.silent = true;
}

module.exports = logger;
