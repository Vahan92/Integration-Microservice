"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// Modules from this project
const integration_1 = require("../model/integration");
// Utils
const logger_1 = require("../utilities/logger");
const errors_1 = require("../utilities/errors");
class IntegrationRouter {
    constructor() {
        this.integration = new integration_1.Integration();
        this.router = express_1.Router();
        this.init();
    }
    generateKeys(request, response, next) {
        // TODO user authentication headers
        const authKey = request.headers['auth-key'];
        const body = request.body;
        this.integration.getKeysByUserKey(body.userKey, body.platform)
            .then((keys) => {
            if (!body.force) {
                response.status(200);
                if (keys.length) {
                    response.send({
                        // TODO: use _get
                        clientId: keys[0].client_id || '',
                        privateKey: keys[0].private_key || ''
                    });
                }
                return;
            }
            if (!keys.length) {
                this.integration.generateKeys(body.userKey, body.platform)
                    .then((newKeys) => {
                    response.status(200);
                    response.send(newKeys);
                })
                    .catch((err) => {
                    logger_1.winstonLogger.error(err);
                    const error = errors_1.errors.getError(errors_1.EErrorCode.INVALID_REQUEST_PARAMS, err);
                    response.status(error.status_code);
                    response.send(error.body);
                });
                return;
            }
            this.integration.updateKeys(body.userKey, keys[0].client_id, body.platform)
                .then((newKeys) => {
                response.status(200);
                response.send(newKeys);
            })
                .catch((err) => {
                logger_1.winstonLogger.error(err);
                const error = errors_1.errors.getError(errors_1.EErrorCode.INVALID_REQUEST_PARAMS, err);
                response.status(error.status_code);
                response.send(error.body);
            });
        })
            .catch((err) => {
            logger_1.winstonLogger.error(err);
            const error = errors_1.errors.getError(errors_1.EErrorCode.INVALID_REQUEST_PARAMS, err);
            response.status(error.status_code);
            response.send(error.body);
        });
    }
    getKeys(request, response, next) {
        const clientId = request.headers['client-id'];
        const platform = request.params.platform;
        if ('magento' !== platform && 'wordpress' !== platform) {
            response.status(200);
            response.send({});
            return;
        }
        this.integration.getKeys(clientId, request.params.platform)
            .then((keys) => {
            if (!keys.length) {
                const error = errors_1.errors.getError(errors_1.EErrorCode.INVALID_REQUEST_PARAMS);
                response.status(error.status_code);
                response.send(error.body);
            }
            response.status(200);
            response.send(keys[0]);
        })
            .catch((err) => {
            logger_1.winstonLogger.error(err);
            const error = errors_1.errors.getError(errors_1.EErrorCode.INVALID_REQUEST_PARAMS, err);
            response.status(error.status_code);
            response.send(error.body);
        });
    }
    validate(request, response, next) {
        const token = request.headers.token;
        const clientId = request.headers['client-id'];
        this.integration.validate(clientId, token, request.params.platform)
            .then((valid) => {
            response.status(202);
            const message = valid ? '' : 'Invalid client id or private key';
            response.send({
                valid: valid,
                message: message
            });
        })
            .catch((err) => {
            logger_1.winstonLogger.error(err);
            const error = errors_1.errors.getError(errors_1.EErrorCode.INVALID_REQUEST_PARAMS, err);
            response.status(error.status_code);
            response.send(error.body);
        });
    }
    getStatus(request, response, next) {
        const userKey = request.headers['auth-key'];
        this.integration.getStatusByUserKey(userKey)
            .then((data) => {
            response.status(200);
            response.send(data);
        })
            .catch((err) => {
            logger_1.winstonLogger.error(err);
            const error = errors_1.errors.getError(errors_1.EErrorCode.INVALID_REQUEST_PARAMS, err);
            response.status(error.status_code);
            response.send(error.body);
        });
    }
    deleteKey(request, response, next) {
        this.integration.deleteKey(request.body.userKey, request.body.platform)
            .then((data) => {
            response.status(200);
            response.send(data);
        })
            .catch((err) => {
            logger_1.winstonLogger.error(err);
            const error = errors_1.errors.getError(errors_1.EErrorCode.INVALID_REQUEST_PARAMS, err);
            response.status(error.status_code);
            response.send(error.body);
        });
    }
    updateStatus(request, response, next) {
        this.integration.updateStatus(request.body.userKey, request.body.platform, request.body.status)
            .then((data) => {
            response.status(200);
            response.send(data);
        })
            .catch((err) => {
            logger_1.winstonLogger.error(err);
            const error = errors_1.errors.getError(errors_1.EErrorCode.INVALID_REQUEST_PARAMS, err);
            response.status(error.status_code);
            response.send(error.body);
        });
    }
    /**
     * Take each handler, and attach toz one of the Express.Router's endpoints.
     */
    init() {
        this.router.post('/generate', (request, response, next) => {
            this.generateKeys(request, response, next);
        });
        this.router.get('/keys/:platform', (request, response, next) => {
            this.getKeys(request, response, next);
        });
        this.router.get('/validate', (request, response, next) => {
            this.validate(request, response, next);
        });
        this.router.get('/platforms', (request, response, next) => {
            this.getStatus(request, response, next);
        });
        // TODO: chenge post to delete
        this.router.delete('/delete', (request, response, next) => {
            this.deleteKey(request, response, next);
        });
        this.router.put('/status', (request, response, next) => {
            this.updateStatus(request, response, next);
        });
    }
}
const integrationRouter = new IntegrationRouter().router;
exports.integrationRouter = integrationRouter;
//# sourceMappingURL=/home/armine_ha/Desktop/integration-microservice/dist/server/routes/integrationRouter.js.map