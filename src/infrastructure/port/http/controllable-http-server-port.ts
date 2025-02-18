import {HttpMethod} from './http-method.enum';
import {HttpRouter} from './http-router';
import {MiddlewareFunction, ControllerFunction} from './types';

export interface ControllableHttpServerPort {
  setPort(port: number): unknown;
  register(
    method: HttpMethod,
    url: string,
    middlewareList: Array<MiddlewareFunction>,
    allowedMediaTypes: Array<string>,
    callback: ControllerFunction,
  ): void;
  enableSwaggerUi(path: string, swaggerUi: unknown, swaggerDocument: string);
  enableMiddleware(middleware: MiddlewareFunction): void;
  startListening(): Promise<unknown>;
  stopListening(): Promise<void>;
  setRouter(router: HttpRouter, basePath?: string): void;
}
