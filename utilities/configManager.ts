// import * as nconf from 'nconf';
import { SERVER_CONFIG } from '../config';

interface IServerConfig {
    baseURL: string;
    port: string;
    logDir: string;
    logLevel: string;
    httpsKeyFile?: string;
    httpsCertFile?: string;
    httpsCaFiles?: any;
}

interface IDatabaseConfig {
    database: string,
    host: string,
    password: string;
    port: number;
    user: string;
}

interface IEnvConfig {
    server: IServerConfig;
    db: IDatabaseConfig;
}

const DEFAULT_SERVER_CONFIG: IServerConfig = {
    baseURL: '/api/v2',
    logDir: 'server-log-dev',
    logLevel: 'debug',
    port: '4500',
};

const DEFAULT_DB_CONFIG: IDatabaseConfig = {
    database: 'integration',
    host: 'localhost',
    password: 'root',
    port: 5432,
    user: 'postgres',
};

class ConfigManager {

    public static getInstance() {
        if (!ConfigManager.instance) {
            ConfigManager.instance = new ConfigManager();
        }
        return ConfigManager.instance;
    }

    private static instance: ConfigManager;
    private envConfig: IEnvConfig;
    private env: string;

    private constructor() {
        this.env = process.env.NODE_ENV || 'development';
        const currentEnvConfig = SERVER_CONFIG[this.env];
        if (currentEnvConfig as IEnvConfig) {
            this.envConfig = currentEnvConfig;
            return;
        }
        this.envConfig = {
            server: DEFAULT_SERVER_CONFIG,
            db: DEFAULT_DB_CONFIG,
        };
    }

    /* Public Methods */

    public getConfigManager(): IEnvConfig {
        return this.envConfig;
    }

    public getServerConfig(): IServerConfig {
        return this.envConfig.server;
    }

    public isProduction(): boolean {
        return 'production' === this.env;
    }

    public getEnv(): string {
        return this.env;
    }

    public getAPIBaseUrl(): string {
        return this.getServerConfig().baseURL;
    }

    public getHttpsKeyFile() {
        return this.getServerConfig().httpsKeyFile;
    }

    public getHttpsCertFile() {
        return this.getServerConfig().httpsCertFile;
    }

    public getHttpsCaFiles() {
        return this.getServerConfig().httpsCaFiles;
    }

    public getDatabaseConfig() {
        return this.envConfig.db;
    }
}

export { ConfigManager };
