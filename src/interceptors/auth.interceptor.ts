import {
  globalInterceptor,
  inject,
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  ValueOrPromise,
} from '@loopback/core';
import {HttpErrors, Request, RestBindings} from '@loopback/rest';
import {constants} from '../config/constants';

const CryptoJS = require('crypto-js');
/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
@globalInterceptor('auth', {tags: {name: 'auth'}})
export class AuthInterceptor implements Provider<Interceptor> {
  constructor(
    @inject(RestBindings.Http.REQUEST) private readonly request: Request,
  ) {}

  /**
   * This method is used by LoopBack context to produce an interceptor function
   * for the binding.
   *
   * @returns An interceptor function
   */
  value() {
    return this.intercept.bind(this);
  }

  /**
   * The logic to intercept an invocation
   * @param invocationCtx - Invocation context
   * @param next - A function to invoke next interceptor or the target method
   */
  async intercept(
    invocationCtx: InvocationContext,
    next: () => ValueOrPromise<InvocationResult>,
  ) {
    try {
      const apiKey = this.request.query.apikey ?? this.request.headers.apikey;

      if (apiKey === '' || apiKey === undefined || apiKey === null) {
        throw new HttpErrors.BadRequest('No apikey or Token provided');
      }

      const bytes = CryptoJS.AES.decrypt(apiKey, constants.secretkey);
      let currentTime = bytes.toString(CryptoJS.enc.Utf8);
      const dateNow = new Date();

      currentTime = new Date(currentTime.split(constants.secretkey));

      const addedTime = new Date(currentTime.getTime() + 5 * 60000);
      const newTime = new Date(dateNow.getTime() + 5 * 60000);

      if (addedTime.toISOString() <= newTime.toISOString()) {
        const newToken = CryptoJS.AES.encrypt(
          newTime.toISOString(),
          constants.secretkey,
        ).toString();

        throw new HttpErrors.Unauthorized(newToken);
      }
      // Add pre-invocation logic here
      const result = await next();
      // Add post-invocation logic here
      return result;
    } catch (err) {
      // Add error handling logic here
      throw err;
    }
  }
}
