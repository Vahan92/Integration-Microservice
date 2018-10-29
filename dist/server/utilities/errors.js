"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const configManager_1 = require("./configManager");
var EErrorCode;
(function (EErrorCode) {
    EErrorCode[EErrorCode["INVALID_REQUEST_PARAMS"] = 325] = "INVALID_REQUEST_PARAMS";
    EErrorCode[EErrorCode["UNAUTHORIZED"] = 135] = "UNAUTHORIZED";
    EErrorCode[EErrorCode["FORBIDDEN"] = 179] = "FORBIDDEN";
})(EErrorCode = exports.EErrorCode || (exports.EErrorCode = {}));
class Errors {
    constructor() {
        this.errors = new Object();
        // TODO: return 200 for prod
        this.errors[EErrorCode.INVALID_REQUEST_PARAMS] = {
            prod: {
                status_code: 400,
                body: {
                    code: 325,
                    message: 'Invalid request parameters.',
                },
            },
            dev: {
                status_code: 400,
                body: {
                    code: 325,
                    message: 'Invalid request parameters',
                },
            },
        };
        this.errors[EErrorCode.UNAUTHORIZED] = {
            prod: {
                status_code: 401,
                body: {
                    code: 135,
                    message: 'Could not authenticate you	',
                },
            },
            dev: {
                status_code: 401,
                body: {
                    code: 135,
                    message: 'Could not authenticate you',
                },
            },
        };
        this.errors[EErrorCode.FORBIDDEN] = {
            prod: {
                status_code: 403,
                body: {
                    code: 179,
                    message: 'Sorry, you are not authorized to perform this action',
                },
            },
            dev: {
                status_code: 403,
                body: {
                    code: 179,
                    message: 'Sorry, you are not authorized to perform this action',
                },
            },
        };
    }
    /**
     * Gets the correct response body based on provided code
     *
     * @param eCode - one of the error codes
     * @param additionalMessage - additional string, appears only for development mode
     */
    getError(eCode, additionalMessage) {
        if (!this.errors[eCode]) {
            return {
                status_code: 500,
                body: {
                    code: 500,
                    message: `Unknown error. ${additionalMessage}`,
                }
            };
        }
        const error = configManager_1.ConfigManager.getInstance().isProduction() ? this.errors[eCode].prod : this.errors[eCode].dev;
        const obj = Object.assign({}, error);
        if (additionalMessage && !configManager_1.ConfigManager.getInstance().isProduction()) {
            obj.body.message += additionalMessage;
        }
        return obj;
    }
}
exports.errors = new Errors();
//# sourceMappingURL=/home/armine_ha/Desktop/integration-microservice/dist/server/utilities/errors.js.map