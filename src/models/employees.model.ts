import {Entity, model, property} from '@loopback/repository';

@model()
export class Employees extends Entity {
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
  firstName: string;

  @property({
    type: 'string',
    required: true,
  })
  lastName: string;

  @property({
    type: 'string',
    required: true,
  })
  emailId: string;

  @property({
    type: 'string',
    required: true,
  })
  employeeId: string;

  @property({
    type: 'string',
    required: true,
  })
  organizationName: string;

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

  constructor(data?: Partial<Employees>) {
    super(data);
  }
}

export interface EmployeesRelations {
  // describe navigational properties here
}

export type EmployeesWithRelations = Employees & EmployeesRelations;
