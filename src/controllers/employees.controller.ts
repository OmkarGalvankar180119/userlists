import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {CommonComponent} from '../components/common.components';
import {Employees} from '../models';
import {EmployeesRepository} from '../repositories';

export class EmployeesController extends CommonComponent {
  constructor(
    @repository(EmployeesRepository)
    public employeesRepository: EmployeesRepository,
  ) {
    super();
  }

  @post('/employees')
  @response(200, {
    description: 'Employees model instance',
    content: {'application/json': {schema: getModelSchemaRef(Employees)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Employees, {
            title: 'NewEmployees',
            exclude: ['id'],
          }),
        },
      },
    })
    employees: Omit<Employees, 'id'>,
  ): Promise<Employees> {
    await this.validateEmployeesData(employees);
    return this.employeesRepository.create(employees).catch(e => {
      throw new HttpErrors.UnprocessableEntity(e.message);
    });
  }

  @get('/employees/count')
  @response(200, {
    description: 'Employees model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Employees) where?: Where<Employees>,
  ): Promise<Count> {
    return this.employeesRepository.count(where);
  }

  @get('/employees')
  @response(200, {
    description: 'Array of Employees model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Employees, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Employees) filter?: Filter<Employees>,
  ): Promise<Employees[]> {
    return this.employeesRepository.find(filter);
  }

  @patch('/employees')
  @response(200, {
    description: 'Employees PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Employees, {partial: true}),
        },
      },
    })
    employees: Employees,
    @param.where(Employees) where?: Where<Employees>,
  ): Promise<Count> {
    return this.employeesRepository.updateAll(employees, where);
  }

  @get('/employees/{id}')
  @response(200, {
    description: 'Employees model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Employees, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Employees, {exclude: 'where'})
    filter?: FilterExcludingWhere<Employees>,
  ): Promise<Employees> {
    return this.employeesRepository.findById(id, filter);
  }

  @patch('/employees/{id}')
  @response(204, {
    description: 'Employees PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Employees, {partial: true}),
        },
      },
    })
    employees: Employees,
  ): Promise<void> {
    await this.employeesRepository.updateById(id, employees);
  }

  @put('/employees/{id}')
  @response(204, {
    description: 'Employees PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() employees: Employees,
  ): Promise<void> {
    await this.employeesRepository.replaceById(id, employees);
  }

  @del('/employees/{id}')
  @response(204, {
    description: 'Employees DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.employeesRepository.deleteById(id);
  }
}
