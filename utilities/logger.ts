import * as fs from 'fs';
import * as path from 'path';
import * as winston from 'winston';

import * as FileStreamRotator from 'file-stream-rotator';

import { ConfigManager } from './configManager';

const configManager = ConfigManager.getInstance();
const serverConfig = configManager.getServerConfig();
const logDirectory = path.join(__dirname, '..', serverConfig.logDir);
const LOG_LEVEL = serverConfig.logLevel;
const logFileName = path.join(logDirectory, 'log_' + new Date().getTime() + '.log');

// Create the directory if it missing
const status = fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// Winston configuration
winston.setLevels(winston.config.npm.levels);
winston.addColors(winston.config.npm.colors);

const winstonLogger = new (winston.Logger)({
    exitOnError: false,
    transports: [
        new (winston.transports.File)({
            colorize: true,
            filename: logFileName,
            handleExceptions: true,
            json: false,
            level: LOG_LEVEL,
            maxsize: 5242880, // 5MB
            name: 'logger-file',
            timestamp: Date.now(),
        }),
        new winston.transports.Console({
            colorize: true,
            handleExceptions: true,
            level: LOG_LEVEL,
            name: 'logger-console',
            timestamp: Date.now(),
        }),
    ],
});

const accessLogStream = FileStreamRotator.getStream({
    filename: logDirectory + '/api-%DATE%.log',
    frequency: '1d',
    verbose: false,
});

function exceptionMiddleware(err, req, res, next) {
    winstonLogger.error(err.message, { stack: err.stack });
    next(err);
}

function logAndCrash(err) {
    winstonLogger.error(err.message, { stack: err.stack });
    throw err;
}

export { accessLogStream, exceptionMiddleware, logAndCrash, winstonLogger };
