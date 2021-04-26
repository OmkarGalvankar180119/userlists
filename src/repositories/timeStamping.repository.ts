import {
  Count,
  DefaultCrudRepository,
  Entity,
  juggler,
  Where,
} from '@loopback/repository';
import {Options} from 'loopback-datasource-juggler';

export class TimestampingRepository<
  T extends Entity,
  ID
> extends DefaultCrudRepository<T, ID> {
  constructor(
    public entityClass: typeof Entity & {prototype: T},
    public dataSource: juggler.DataSource,
  ) {
    super(entityClass, dataSource);
    // TODO: check whether the model has updatedAt/createdAt properties?
  }

  async create(entity: any, options?: Options): Promise<T> {
    entity.createdAt = new Date();
    entity.updatedAt = new Date();

    return super.create(entity, options);
  }

  async updateAll(
    data: any,
    where?: Where<T>,
    options?: Options,
  ): Promise<Count> {
    data.updatedAt = new Date();

    return super.updateAll(data, where, options);
  }

  async replaceById(id: ID, data: any, options?: Options): Promise<void> {
    data.updatedAt = new Date();
    const existingData: any = await this.findById(id);
    data.createdAt = existingData.createdAt;

    delete data.id;

    return super.replaceById(id, data, options);
  }
}
