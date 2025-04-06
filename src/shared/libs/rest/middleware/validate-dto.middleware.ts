import { NextFunction, Request, Response } from 'express';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { StatusCodes } from 'http-status-codes';

import { Middleware } from './middleware.interface.js';
import { HttpError } from '../errors/index.js';

export class ValidateDtoMiddleware implements Middleware {
  constructor(private dto: ClassConstructor<object>) { }

  public async execute({ body }: Request, res: Response, next: NextFunction): Promise<void> {
    const dtoInstance = plainToInstance(this.dto, body);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      const messages = errors.map((error) =>
        Object.values(error.constraints ?? {}).join(', ')
      ).join('; ');
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `DTO Validation Error: ${messages}`,
        'ValidateDtoMiddleware'
      );
    }

    next();
  }
}
