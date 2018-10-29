import { IDatabase, IMain } from 'pg-promise';
import * as pgPromise from 'pg-promise';

// TODO: use configManager
import { SERVER_CONFIG } from '../config';
import { winstonLogger } from '../utilities/logger';
import { ConfigManager } from '../utilities/configManager';

class Database {

  private db: IDatabase<any>;

  constructor() {
    this.init();
  }

  public getDB() {
    return this.db;
  }

  private init() {
    const pgp: IMain = pgPromise({});
    this.db = pgp(ConfigManager.getInstance().getDatabaseConfig());
    this.db.connect()
      .then((data) => {
        winstonLogger.info('Data Base connection success ...', process.env.NODE_ENV);
      })
      .catch((err) => {
        winstonLogger.error('Database connection failed by: ' + err);
        // TODO: halt the server to avoid issues
      });
  }
}

// TODO: Make singletone
const database: any = new Database();
export let db = database.getDB();
