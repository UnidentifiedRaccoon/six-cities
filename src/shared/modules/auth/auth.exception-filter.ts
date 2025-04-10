import { inject, injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';

import { ExceptionFilter } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { BaseUserException } from './errors/index.js';
import { COMPONENT_MAP } from '../../types/component-map.enum.js';

@injectable()
export class AuthExceptionFilter implements ExceptionFilter {
  constructor(
    @inject(COMPONENT_MAP.LOGGER) private readonly logger: Logger
  ) {
    this.logger.info('Register AuthExceptionFilter');
  }

  public catch(error: unknown, _req: Request, res: Response, next: NextFunction): void {
    if (!(error instanceof BaseUserException)) {
      return next(error);
    }

    this.logger.error(`[AuthModule] ${error.message}`, error);
    res.status(error.httpStatusCode)
      .json({
        type: 'AUTHORIZATION',
        error: error.message,
      });
  }
}
