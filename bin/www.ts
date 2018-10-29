#!/usr/bin/env node

/**
 * Module dependencies.
 */
import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';
import { app } from '../app';
import { ConfigManager } from '../utilities/configManager';
import { winstonLogger } from '../utilities/logger';

/**
 * Get port from environment and store in Express.
 */
const configManager = ConfigManager.getInstance();
const port = normalizePort(process.env.PORT || configManager.getServerConfig().port || '4300');
app.set('port', port);

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
    server = https.createServer(options, app);
} else {
    server = http.createServer(app);
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
function normalizePort(val): boolean | number {
    const normalizedPort: number = (typeof val === 'string') ? parseInt(val, 10) : val;

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
            winstonLogger.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            winstonLogger.error(bind + ' is already in use');
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
    winstonLogger.info('Listening on' + bind);
}
