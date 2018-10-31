import { NextFunction, Request, Response, Router } from 'express';

// Modules from this project
import { Integration } from "../model/integration";

// Utils
import { winstonLogger } from '../utilities/logger';
import { EErrorCode, errors, IError } from '../utilities/errors'

class IntegrationRouter {
  public router: Router;

  private integration: Integration;

  constructor() {
    this.integration = new Integration();
    this.router = Router();
    this.init();
  }

  private generateKeys(request: Request, response: Response, next: NextFunction): void {
    // TODO user authentication headers
    const authKey = request.headers['auth-key'] as string;
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
              winstonLogger.error(err);
              const error: IError = errors.getError(EErrorCode.INVALID_REQUEST_PARAMS, err);
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
            winstonLogger.error(err);
            const error: IError = errors.getError(EErrorCode.INVALID_REQUEST_PARAMS, err);
            response.status(error.status_code);
            response.send(error.body);
          });
      })
      .catch((err) => {
        winstonLogger.error(err);
        const error: IError = errors.getError(EErrorCode.INVALID_REQUEST_PARAMS, err);
        response.status(error.status_code);
        response.send(error.body);
      });
  }

  private getKeys(request: Request, response: Response, next: NextFunction): void {
    const clientId = request.headers['client-id'] as string;
    const platform = request.params.platform;

    if ('magento' !== platform && 'wordpress' !== platform) {
      response.status(200);
      response.send({});
      return;
    }
    this.integration.getKeys(clientId, request.params.platform)
      .then((keys) => {
        if (!keys.length) {
          const error: IError = errors.getError(EErrorCode.INVALID_REQUEST_PARAMS);
          response.status(error.status_code);
          response.send(error.body);
        }
        response.status(200);
        response.send(keys[0]);
      })
      .catch((err) => {
        winstonLogger.error(err);
        const error: IError = errors.getError(EErrorCode.INVALID_REQUEST_PARAMS, err);
        response.status(error.status_code);
        response.send(error.body);
      });
  }

  private validate(request: Request, response: Response, next: NextFunction): void {
    const token = request.headers.token as string;
    const clientId = request.headers['client-id'] as string;

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
        winstonLogger.error(err);
        const error: IError = errors.getError(EErrorCode.INVALID_REQUEST_PARAMS, err);
        response.status(error.status_code);
        response.send(error.body);
      });
  }

  private getStatus(request: Request, response: Response, next: NextFunction): void {    
    const userKey = request.headers['auth-key'] as string;
    this.integration.getStatusByUserKey(userKey)
      .then((data) => {
        response.status(200);
        response.send(data);
      })
      .catch((err) => {
        winstonLogger.error(err);
        const error: IError = errors.getError(EErrorCode.INVALID_REQUEST_PARAMS, err);
        response.status(error.status_code);
        response.send(error.body);
      });
  }

  private deleteKey(request: Request, response: Response, next: NextFunction): void {
    this.integration.deleteKey(request.body.userKey, request.body.platform)
      .then((data) => {
        response.status(200);
        response.send(data);
      })
      .catch((err) => {
        winstonLogger.error(err);
        const error: IError = errors.getError(EErrorCode.INVALID_REQUEST_PARAMS, err);
        response.status(error.status_code);
        response.send(error.body);
      });
  }

  private updateStatus(request: Request, response: Response, next: NextFunction) {
    this.integration.updateStatus(request.body.userKey, request.body.platform, request.body.status)
      .then((data) => {
        response.status(200);
        response.send(data);
      })
      .catch((err) => {
        winstonLogger.error(err);
        const error: IError = errors.getError(EErrorCode.INVALID_REQUEST_PARAMS, err);
        response.status(error.status_code);
        response.send(error.body);
      });
  }

  /**
   * Take each handler, and attach toz one of the Express.Router's endpoints.
   */
  private init() {
    this.router.post('/generate', (request: Request, response: Response, next: NextFunction): void => {
      this.generateKeys(request, response, next);
    });

    this.router.get('/keys/:platform', (request: Request, response: Response, next: NextFunction): void => {
      this.getKeys(request, response, next);
    });

    this.router.get('/validate', (request: Request, response: Response, next: NextFunction): void => {
      this.validate(request, response, next);
    });

    this.router.get('/platforms', (request: Request, response: Response, next: NextFunction): void => {
      this.getStatus(request, response, next);
    });

    // TODO: chenge post to delete
    this.router.delete('/delete', (request: Request, response: Response, next: NextFunction): void => {
      this.deleteKey(request, response, next);
    });

    this.router.put('/status', (request: Request, response: Response, next: NextFunction): void => {
      this.updateStatus(request, response, next);
    });

  }
}

const integrationRouter = new IntegrationRouter().router;
export { integrationRouter };
