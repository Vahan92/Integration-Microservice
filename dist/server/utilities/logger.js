"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const winston = require("winston");
const FileStreamRotator = require("file-stream-rotator");
const configManager_1 = require("./configManager");
const configManager = configManager_1.ConfigManager.getInstance();
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
            maxsize: 5242880,
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
exports.winstonLogger = winstonLogger;
const accessLogStream = FileStreamRotator.getStream({
    filename: logDirectory + '/api-%DATE%.log',
    frequency: '1d',
    verbose: false,
});
exports.accessLogStream = accessLogStream;
function exceptionMiddleware(err, req, res, next) {
    winstonLogger.error(err.message, { stack: err.stack });
    next(err);
}
exports.exceptionMiddleware = exceptionMiddleware;
function logAndCrash(err) {
    winstonLogger.error(err.message, { stack: err.stack });
    throw err;
}
exports.logAndCrash = logAndCrash;
//# sourceMappingURL=/home/armine_ha/Desktop/integration-microservice/dist/server/utilities/logger.js.map