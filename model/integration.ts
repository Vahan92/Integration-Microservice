import { db } from '../database/database';
import { winstonLogger } from '../utilities/logger';

import * as NodeRSA from 'node-rsa';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';

export class Integration {

  constructor() {
  }

  public generateKeys(userKey: string, platform: string): Promise<any> {
    const date = (new Date()).valueOf().toString();
    const hash = crypto.createHash('sha1').update(date + userKey).digest('hex');

    const key = new NodeRSA({ b: 512 });
    key.generateKeyPair([2048], [65537]);
    const publicKey = key.exportKey('pkcs1-public-pem')
    const privateKey = key.exportKey('pkcs1-private-pem')

    return new Promise<any>((resolve, reject) => {
      db.query('INSERT INTO auth_keys (key, private_key, public_key, client_id, platform) VALUES ($1 ,$2 ,$3 ,$4, $5);', [
        userKey,
        privateKey,
        publicKey,
        hash,
        platform
      ])
        .then(() => {
          resolve({
            clientId: hash,
            privateKey: privateKey,
            platform: platform
          });
        })
        .catch((err) => {
          winstonLogger.error(err);
          reject(err);
        });
    });
  }

  public updateKeys(userKey: string, clientId: string, platform): Promise<any> {
    const key = new NodeRSA({ b: 512 });

    key.generateKeyPair([2048], [65537]);
    const publicKey = key.exportKey('pkcs1-public-pem')
    const privateKey = key.exportKey('pkcs1-private-pem')
    if (!clientId) {
      const date = (new Date()).valueOf().toString();
      clientId = crypto.createHash('sha1').update(date + userKey).digest('hex');
    }
    return new Promise<any>((resolve, reject) => {
      db.query('UPDATE auth_keys SET private_key=$1, public_key=$2, client_id=$3 WHERE key=$4 and platform=$5;', [
        privateKey,
        publicKey,
        clientId,
        userKey,
        platform,
      ])
        .then(() => {
          resolve({
            clientId: clientId,
            platform: platform,
            privateKey: privateKey
          });
        })
        .catch((err) => {
          winstonLogger.error(err);
          reject(err);
        });
    });
  }

  public updateStatus(key: string, platform: string, status: boolean): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      db.query('UPDATE auth_keys SET disable=$1 WHERE key=$2 and platform=$3;', [
        status,
        key,
        platform,
      ])
        .then(() => {
          resolve({
            status: status,
            platform: platform
          });
        })
        .catch((err) => {
          winstonLogger.error(err);
          reject(err);
        });
    });

  }

  public getKeysByUserKey(userKey: string, platform: string): Promise<any> {
    return db.query('SELECT private_key, client_id FROM auth_keys WHERE key=$1 AND platform=$2;', [userKey, platform]);
  }

  public getKeys(clientId: string, platform: string): Promise<any> {
    return db.query('SELECT key, private_key, client_id FROM auth_keys WHERE client_id=$1 AND platform=$2;', [clientId, platform]);
  }

  public validate(clientId: string, token: string, platform: string): Promise<any> {
    return new Promise<boolean>((resolve, reject) => {
      this.getKeys(clientId, platform)
        .then((keys) => {
          if (!keys.length) {
            reject('Invalid request parameters');
            return;
          }

          jwt.verify(token, keys[0].private_key, (err, decoded) => {
            if (err) {
              resolve(false);
            } else {
              resolve(true);
            }
          });
        })
        .catch((err) => {
          winstonLogger.error(err);
          reject(err);
        });
    });
  }

  public getStatusByUserKey(userKey: string): Promise<any> {
    return db.query(`SELECT platform, disable as status FROM auth_keys WHERE key=$1;`, [userKey]);
  }

  public deleteKey(userKey: string, platform: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      db.query('UPDATE auth_keys SET private_key=$3, public_key=$4, client_id=$5 WHERE key=$1 and platform=$2;', [
        userKey,
        platform,
        '',
        '',
        ''
      ])
        .then(() => {
          resolve({
            status: false,
            platform: platform
          });
        })
        .catch((err) => {
          winstonLogger.error(err);
          reject(err);
        });
    });
  }
}