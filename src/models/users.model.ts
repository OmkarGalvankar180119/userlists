import {Entity, model, property} from '@loopback/repository';

@model()
export class Users extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  identifier: string;

  @property({
    type: 'string',
    required: true,
  })
  emailId: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'number',
    default: 1,
  })
  statusId?: number;

  @property({
    type: 'date',
    default: new Date(),
  })
  createdAt?: string;

  @property({
    type: 'date',
    default: new Date(),
  })
  updatedAt?: string;

  constructor(data?: Partial<Users>) {
    super(data);
  }
}

export interface UsersRelations {
  // describe navigational properties here
}

export type UsersWithRelations = Users & UsersRelations;
