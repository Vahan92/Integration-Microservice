import { ConfigManager } from './configManager'

export enum EErrorCode {
  INVALID_REQUEST_PARAMS = 325,
  UNAUTHORIZED = 135,
  FORBIDDEN = 179,
}

export interface IError {
  status_code: number;
  body: {
    code?: number,
    message?: string,
  };
}

class Errors {
  private errors = new Object();

  constructor() {
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
  public getError(eCode: EErrorCode, additionalMessage?: string): IError {
    if (!this.errors[eCode]) {
      return {
        status_code: 500,
        body: {
          code: 500,
          message: `Unknown error. ${additionalMessage}`,
        }
      } as IError;
    }
    const error = ConfigManager.getInstance().isProduction() ? this.errors[eCode].prod : this.errors[eCode].dev;
    const obj = (Object as any).assign({}, error) as IError;
    if (additionalMessage && !ConfigManager.getInstance().isProduction()) {
      obj.body.message += additionalMessage;
    }
    return obj;
  }
}

export const errors: Errors = new Errors();