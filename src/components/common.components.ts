import {Component} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import Joi from 'joi';

export class CommonComponent implements Component {
  private readonly usersReqSchema: any = Joi.object().keys({
    identifier: Joi.string().trim(),
    emailId: Joi.string().email().required(),
    password: Joi.string().trim().min(6).max(12).required(),
    statusId: Joi.number().integer().min(0).max(1).default(1),
  });

  private readonly employeesReqSchema: any = Joi.object().keys({
    firstName: Joi.string().trim().required(),
    lastName: Joi.string().trim().allow('').required(),
    emailId: Joi.string().email().required(),
    employeeId: Joi.string().trim().required(),
    organizationName: Joi.string().trim().required(),
    statusId: Joi.number().integer().min(0).max(1).default(1),
  });

  private readonly loginReqSchema: any = Joi.object().keys({
    emailId: Joi.string().email().required(),
    password: Joi.string().trim().min(6).max(12).required(),
  });

  protected validateUsersData(data: object): void {
    const result = this.usersReqSchema.validate(data);
    return this.schemaValidate(result);
  }

  protected validateEmployeesData(data: object): void {
    const result = this.employeesReqSchema.validate(data);
    return this.schemaValidate(result);
  }

  protected validateLoginData(data: object): void {
    const result = this.loginReqSchema.validate(data);
    return this.schemaValidate(result);
  }

  schemaValidate(result: any): any {
    if (!(result && result.error === undefined)) {
      throw new HttpErrors.UnprocessableEntity(
        result.error.details[0].message.replace(/"/g, ''),
      );
    }
  }
}
