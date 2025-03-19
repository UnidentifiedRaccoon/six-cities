import { config } from 'dotenv';
import { inject, injectable } from 'inversify';

import { configRestSchema } from './rest.schema.js';

import { Logger } from '../logger/logger.interface.js';
import { Config } from './config.interface.js';
import { COMPONENT_MAP } from '../../types/index.js';
import { RestSchema } from './rest.schema.type.js';

@injectable()
export class RestConfig implements Config<RestSchema> {
  private readonly config: RestSchema;

  constructor(
    @inject(COMPONENT_MAP.LOGGER) private readonly logger: Logger
  ) {
    const parsedOutput = config();

    if (parsedOutput.error) {
      throw new Error('Can\'t read .env file. Perhaps the file does not exists.');
    }

    configRestSchema.load({});
    configRestSchema.validate({ allowed: 'strict', output: this.logger.info });

    this.config = configRestSchema.getProperties();
    this.logger.info('RestConfig created…');
    this.logger.info('.env file found and successfully parsed!');
  }

  public get<T extends keyof RestSchema>(key: T): RestSchema[T] {
    return this.config[key];
  }
}
