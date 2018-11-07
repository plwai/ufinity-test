const express = require('express');
const bodyParser = require('body-parser');
const winston = require('winston');
const expressWinston = require('express-winston');
const fs = require('fs');

const adminRouter = require('./src/router/api/admin.api');
const serverConfig = require('./config/server-config')(process.env.NODE_ENV);
const logger = require('./src/logger/logger');

const app = express();
const { port, mode } = serverConfig;
const logDir = {
  logs: 'logs',
  request: 'logs/requests',
  error: 'logs/error',
  warn: 'logs/warn',
  info: 'logs/info',
};

Object.values(logDir).forEach(type => {
  if (!fs.existsSync(type)) {
    fs.mkdirSync(type);
  }
});

const expressWinstonConfig = expressWinston.logger({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.File({
      name: 'request-file',
      filename: './logs/requests/request.log',
      json: true,
      maxsize: 5242880,
      maxFiles: 10,
    }),
  ],
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressWinstonConfig);
app.use('/api', adminRouter);

// 404 Error
app.use((_req, res, _next) => {
  res.status(404).send('404 Not Found');
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  logger.info(`Listening on port ${port} with mode ${mode}`);
});
