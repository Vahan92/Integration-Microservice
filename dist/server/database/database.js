"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pgPromise = require("pg-promise");
const logger_1 = require("../utilities/logger");
const configManager_1 = require("../utilities/configManager");
console.log('44444');
class Database {
    constructor() {
        this.init();
    }
    getDB() {
        return this.db;
    }
    init() {
        const pgp = pgPromise({});
        this.db = pgp(configManager_1.ConfigManager.getInstance().getDatabaseConfig());
        this.db.connect()
            .then((data) => {
            logger_1.winstonLogger.info('Data Base connection success ...', process.env.NODE_ENV);
        })
            .catch((err) => {
            logger_1.winstonLogger.error('Database connection failed by: ' + err);
            // TODO: halt the server to avoid issues
        });
    }
}
// TODO: Make singletone
const database = new Database();
exports.db = database.getDB();
//# sourceMappingURL=/home/armine_ha/Desktop/integration-microservice/dist/server/database/database.js.map