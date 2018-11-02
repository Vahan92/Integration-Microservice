#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
console.log('0000');
const fs = require("fs");
const http = require("http");
const https = require("https");
const app_1 = require("../app");
const configManager_1 = require("../utilities/configManager");
const logger_1 = require("../utilities/logger");
/**
 * Get port from environment and store in Express.
 */
const configManager = configManager_1.ConfigManager.getInstance();
const port = normalizePort(process.env.PORT || configManager.getServerConfig().port || '4300');
app_1.app.set('port', port);
/**
 * Create HTTP server.
 */
let server;
if (configManager.isProduction()) {
    const intermediateCerts = configManager.getHttpsCaFiles();
    const options = {
        cert: fs.readFileSync(configManager.getHttpsCertFile()),
        key: fs.readFileSync(configManager.getHttpsKeyFile()),
    };
    server = https.createServer(options, app_1.app);
}
else {
    server = http.createServer(app_1.app);
    server.timeout = 10000;
}
/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
    const normalizedPort = (typeof val === 'string') ? parseInt(val, 10) : val;
    if (isNaN(normalizedPort)) {
        return val;
    }
    if (normalizedPort >= 0) {
        // port number
        return normalizedPort;
    }
    return false;
}
/**
 * Event listener for HTTP server 'error' event.
 */
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            logger_1.winstonLogger.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            logger_1.winstonLogger.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}
/**
 * Event listener for HTTP server 'listening' event.
 */
function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    logger_1.winstonLogger.info('Listening on ' + bind);
}
exports.currentServer = server;
//# sourceMappingURL=/home/armine_ha/Desktop/integration-microservice/dist/server/bin/www.js.map