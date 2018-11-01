"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
console.log('3333');
const database_1 = require("../database/database");
const logger_1 = require("../utilities/logger");
const NodeRSA = require("node-rsa");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
class Integration {
    constructor() {
    }
    generateKeys(userKey, platform) {
        const date = (new Date()).valueOf().toString();
        const hash = crypto.createHash('sha1').update(date + userKey).digest('hex');
        const key = new NodeRSA({ b: 512 });
        key.generateKeyPair([2048], [65537]);
        const publicKey = key.exportKey('pkcs1-public-pem');
        const privateKey = key.exportKey('pkcs1-private-pem');
        return new Promise((resolve, reject) => {
            database_1.db.query('INSERT INTO auth_keys (key, private_key, public_key, client_id, platform) VALUES ($1 ,$2 ,$3 ,$4, $5);', [
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
                logger_1.winstonLogger.error(err);
                reject(err);
            });
        });
    }
    updateKeys(userKey, clientId, platform) {
        const key = new NodeRSA({ b: 512 });
        key.generateKeyPair([2048], [65537]);
        const publicKey = key.exportKey('pkcs1-public-pem');
        const privateKey = key.exportKey('pkcs1-private-pem');
        if (!clientId) {
            const date = (new Date()).valueOf().toString();
            clientId = crypto.createHash('sha1').update(date + userKey).digest('hex');
        }
        return new Promise((resolve, reject) => {
            database_1.db.query('UPDATE auth_keys SET private_key=$1, public_key=$2, client_id=$3 WHERE key=$4 and platform=$5;', [
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
                logger_1.winstonLogger.error(err);
                reject(err);
            });
        });
    }
    updateStatus(key, platform, status) {
        return new Promise((resolve, reject) => {
            database_1.db.query('UPDATE auth_keys SET disable=$1 WHERE key=$2 and platform=$3;', [
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
                logger_1.winstonLogger.error(err);
                reject(err);
            });
        });
    }
    getKeysByUserKey(userKey, platform) {
        return database_1.db.query('SELECT private_key, client_id FROM auth_keys WHERE key=$1 AND platform=$2;', [userKey, platform]);
    }
    getKeys(clientId, platform) {
        return database_1.db.query('SELECT key, private_key, client_id FROM auth_keys WHERE client_id=$1 AND platform=$2;', [clientId, platform]);
    }
    validate(clientId, token, platform) {
        return new Promise((resolve, reject) => {
            this.getKeys(clientId, platform)
                .then((keys) => {
                if (!keys.length) {
                    reject('Invalid request parameters');
                    return;
                }
                jwt.verify(token, keys[0].private_key, (err, decoded) => {
                    if (err) {
                        resolve(false);
                    }
                    else {
                        resolve(true);
                    }
                });
            })
                .catch((err) => {
                logger_1.winstonLogger.error(err);
                reject(err);
            });
        });
    }
    getStatusByUserKey(userKey) {
        return database_1.db.query(`SELECT platform, disable as status FROM auth_keys WHERE key=$1;`, [userKey]);
    }
    deleteKey(userKey, platform) {
        return new Promise((resolve, reject) => {
            database_1.db.query('UPDATE auth_keys SET private_key=$3, public_key=$4, client_id=$5 WHERE key=$1 and platform=$2;', [
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
                logger_1.winstonLogger.error(err);
                reject(err);
            });
        });
    }
}
exports.Integration = Integration;
//# sourceMappingURL=/home/armine_ha/Desktop/integration-microservice/dist/server/model/integration.js.map