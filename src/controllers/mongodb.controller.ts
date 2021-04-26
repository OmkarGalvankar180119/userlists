import {repository} from '@loopback/repository';
import {EmployeesRepository} from '../repositories';

export class MongodbController {
  constructor(
    @repository(EmployeesRepository)
    public employeesRepository: EmployeesRepository,
  ) {}

  async createIndexForEmployeesCollection() {
    try {
      const database = await this.getDB(this.employeesRepository);

      await database.collection('Employees').createIndex(
        {
          employeeId: 1,
        },
        {
          unique: true,
          name: 'unique-employeeId-index',
          partialFilterExpression: {
            statusId: {$lt: 2},
          },
        },
      );

      await database.collection('Employees').createIndex(
        {
          emailId: 1,
        },
        {
          unique: true,
          name: 'unique-emailId-index',
          partialFilterExpression: {
            statusId: {$lt: 2},
          },
        },
      );
    } catch (error) {
      console.log(error.message);
    }
  }
  async getDB(dbRepository: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const a = dbRepository.dataSource.connector as any;
      a.connect((e: any, db: any) => {
        if (e) {
          return reject(e);
        }
        return resolve(db);
      });
    });
  }
}
