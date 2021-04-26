import {inject} from '@loopback/core';
import {DbDataSource} from '../datasources';
import {Employees} from '../models';
import {TimestampingRepository} from './timeStamping.repository';

export class EmployeesRepository extends TimestampingRepository<
  Employees,
  typeof Employees.prototype.id
> {
  constructor(@inject('datasources.db') dataSource: DbDataSource) {
    super(Employees, dataSource);
  }
}
