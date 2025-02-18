import {HttpMethod} from './http-method.enum';
import {ControllerFunction, MiddlewareFunction} from './types';

export interface HttpRouteDefinition {
  method: HttpMethod;
  controller: ControllerFunction;
  middlewareList: Array<MiddlewareFunction>;
  allowedMediaTypes?: Array<string>;
}
