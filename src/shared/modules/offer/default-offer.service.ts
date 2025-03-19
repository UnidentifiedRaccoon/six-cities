import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';

import { Logger } from '../../libs/logger/index.js';
import { OfferService, CreateOfferDto, OfferEntity } from './index.js';
import { COMPONENT_MAP } from '../../types/index.js';

import { Nullable } from '../../types/help.type.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(COMPONENT_MAP.LOGGER) private readonly logger: Logger,
    @inject(COMPONENT_MAP.OFFER_MODEL) private readonly offerModel: types.ModelType<OfferEntity>
  ) { }

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.title}`);

    return result;
  }

  public async findById(offerId: string): Promise<Nullable<DocumentType<OfferEntity>>> {
    return this.offerModel.findById(offerId).exec();
  }
}
