// Modules from node
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as cors from 'cors';
import * as express from 'express';
import * as helmet from 'helmet';
import * as logger from 'morgan';

import { Application, NextFunction, Request, Response, Router } from 'express';

console.log('1111');

// Router Modules
import { integrationRouter } from './routes/integrationRouter';

// Modules from this project
import { ConfigManager } from './utilities/configManager';
import { accessLogStream, exceptionMiddleware, logAndCrash } from './utilities/logger';

class App {

    // Reference to Express instance
    public express: Application;
    private corsOptions = {
        credentials: true,
        origin: '*',
    };
    private configManager = ConfigManager.getInstance();

    constructor() {
        this.express = express();
        this.init();
        this.setupHeaders();
        this.setupRoutes();
    }

    /**
     * Configure Express middleware.
     */
    private init(): void {
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
    private setupLogger(): void {
        this.express.use(exceptionMiddleware);
        process.on('uncaughtException', logAndCrash);
        this.express.use(logger('combined', { stream: accessLogStream }));
    }

    /**
     *  Configure API endpoints.
     */
    private setupRoutes(): void {
        const baseURL = this.configManager.getAPIBaseUrl();
        this.express.use(baseURL + '/', integrationRouter);
    }

    /**
     * Configure Response headers for GET Requests
     */
    private setupHeaders(): void {
        const baseURL = this.configManager.getAPIBaseUrl();
        this.express.post(baseURL + '/*', function (request: Request, response: Response, next: NextFunction) {
            response.header('Access-Control-Allow-Origin', '*');
            response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            next();
        });
    }

}

const app = new App().express;

export { app };
