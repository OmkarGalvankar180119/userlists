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
import {Users} from '../models';
import {EmployeesRepository, UsersRepository} from '../repositories';

const CryptoJS = require('crypto-js'); // for password encrpyt/decrypt
const secretKey = 'secretKey123';

export class UsersController extends CommonComponent {
  constructor(
    @repository(UsersRepository)
    public usersRepository: UsersRepository,
    @repository(EmployeesRepository)
    public employeesRepository: EmployeesRepository,
  ) {
    super();
  }

  @post('/users')
  @response(200, {
    description: 'Users model instance',
    content: {'application/json': {schema: getModelSchemaRef(Users)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Users, {
            title: 'NewUsers',
            exclude: ['id'],
          }),
        },
      },
    })
    users: Omit<Users, 'id'>,
  ): Promise<Users> {
    await this.validateUsersData(users);
    const employee = await this.employeesRepository.findOne({
      where: {id: users.identifier, emailId: users.emailId},
    });

    if (!employee) {
      throw new HttpErrors.UnprocessableEntity('No employee found');
    }

    users.password = CryptoJS.AES.encrypt(users.password, secretKey).toString();

    return this.usersRepository.create(users).catch(e => {
      throw new HttpErrors.UnprocessableEntity(e.message);
    });
  }

  @get('/users/count')
  @response(200, {
    description: 'Users model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Users) where?: Where<Users>): Promise<Count> {
    return this.usersRepository.count(where);
  }

  @get('/users')
  @response(200, {
    description: 'Array of Users model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Users, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Users) filter?: Filter<Users>): Promise<Users[]> {
    return this.usersRepository.find(filter);
  }

  @patch('/users')
  @response(200, {
    description: 'Users PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Users, {partial: true}),
        },
      },
    })
    users: Users,
    @param.where(Users) where?: Where<Users>,
  ): Promise<Count> {
    return this.usersRepository.updateAll(users, where);
  }

  @get('/users/{id}')
  @response(200, {
    description: 'Users model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Users, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Users, {exclude: 'where'})
    filter?: FilterExcludingWhere<Users>,
  ): Promise<Users> {
    return this.usersRepository.findById(id, filter);
  }

  @patch('/users/{id}')
  @response(204, {
    description: 'Users PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Users, {partial: true}),
        },
      },
    })
    users: Users,
  ): Promise<void> {
    await this.usersRepository.updateById(id, users);
  }

  @put('/users/{id}')
  @response(204, {
    description: 'Users PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() users: Users,
  ): Promise<void> {
    await this.usersRepository.replaceById(id, users);
  }

  @del('/users/{id}')
  @response(204, {
    description: 'Users DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.usersRepository.deleteById(id);
  }

  @post('/login')
  @response(200, {
    description: 'Users model instance',
    content: {'application/json': {}},
  })
  async login(
    @requestBody({
      content: {
        'application/json': {},
      },
    })
    reqBody: any,
  ): Promise<any> {
    await this.validateLoginData(reqBody);
    const user: any = await this.usersRepository.findOne({
      where: {emailId: reqBody.emailId},
    });
    const bytes = CryptoJS.AES.decrypt(user.password, secretKey);
    user.password = bytes.toString(CryptoJS.enc.Utf8);

    if (user.password === reqBody.password) {
      return user;
    } else {
      throw new HttpErrors.BadRequest('Invalid emailId and password');
    }
  }
}
