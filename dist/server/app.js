"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Modules from node
const bodyParser = require("body-parser");
const compression = require("compression");
const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const logger = require("morgan");
console.log('1111');
// Router Modules
const integrationRouter_1 = require("./routes/integrationRouter");
// Modules from this project
const configManager_1 = require("./utilities/configManager");
const logger_1 = require("./utilities/logger");
class App {
    constructor() {
        this.corsOptions = {
            credentials: true,
            origin: '*',
        };
        this.configManager = configManager_1.ConfigManager.getInstance();
        this.express = express();
        this.init();
        this.setupHeaders();
        this.setupRoutes();
    }
    /**
     * Configure Express middleware.
     */
    init() {
        this.express.use(cors(this.corsOptions));
        this.express.use(compression());
        this.express.use(bodyParser.raw());
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: true }));
        this.express.use(helmet({ frameguard: false }));
        this.setupLogger();
    }
    /**
     *  Configure morgan logger
     */
    setupLogger() {
        this.express.use(logger_1.exceptionMiddleware);
        process.on('uncaughtException', logger_1.logAndCrash);
        this.express.use(logger('combined', { stream: logger_1.accessLogStream }));
    }
    /**
     *  Configure API endpoints.
     */
    setupRoutes() {
        const baseURL = this.configManager.getAPIBaseUrl();
        this.express.use(baseURL + '/', integrationRouter_1.integrationRouter);
    }
    /**
     * Configure Response headers for GET Requests
     */
    setupHeaders() {
        const baseURL = this.configManager.getAPIBaseUrl();
        this.express.post(baseURL + '/*', function (request, response, next) {
            response.header('Access-Control-Allow-Origin', '*');
            response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            next();
        });
    }
}
const app = new App().express;
exports.app = app;
//# sourceMappingURL=/home/armine_ha/Desktop/integration-microservice/dist/server/app.js.map