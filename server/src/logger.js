import winston from 'winston';

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      level: 'debug',
      json: false,
      colorize: true
    }),
    new (winston.transports.File)({ filename: 'system.log' })
  ]
});

export default logger;
