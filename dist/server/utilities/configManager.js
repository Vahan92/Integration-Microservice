"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import * as nconf from 'nconf';
const config_1 = require("../config");
const DEFAULT_SERVER_CONFIG = {
    baseURL: '/api/v2',
    logDir: 'server-log-dev',
    logLevel: 'debug',
    port: '4500',
};
const DEFAULT_DB_CONFIG = {
    database: 'integration',
    host: 'localhost',
    password: 'root',
    port: 5432,
    user: 'postgres',
};
class ConfigManager {
    static getInstance() {
        if (!ConfigManager.instance) {
            ConfigManager.instance = new ConfigManager();
        }
        return ConfigManager.instance;
    }
    constructor() {
        this.env = process.env.NODE_ENV || 'development';
        const currentEnvConfig = config_1.SERVER_CONFIG[this.env];
        if (currentEnvConfig) {
            this.envConfig = currentEnvConfig;
            return;
        }
        this.envConfig = {
            server: DEFAULT_SERVER_CONFIG,
            db: DEFAULT_DB_CONFIG,
        };
    }
    /* Public Methods */
    getConfigManager() {
        return this.envConfig;
    }
    getServerConfig() {
        return this.envConfig.server;
    }
    isProduction() {
        return 'production' === this.env;
    }
    getEnv() {
        return this.env;
    }
    getAPIBaseUrl() {
        return this.getServerConfig().baseURL;
    }
    getHttpsKeyFile() {
        return this.getServerConfig().httpsKeyFile;
    }
    getHttpsCertFile() {
        return this.getServerConfig().httpsCertFile;
    }
    getHttpsCaFiles() {
        return this.getServerConfig().httpsCaFiles;
    }
    getDatabaseConfig() {
        return this.envConfig.db;
    }
}
exports.ConfigManager = ConfigManager;
//# sourceMappingURL=/home/armine_ha/Desktop/integration-microservice/dist/server/utilities/configManager.js.map