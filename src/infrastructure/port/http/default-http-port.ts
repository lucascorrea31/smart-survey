import {ControllableHttpServerPort} from './controllable-http-server-port';
import {HttpRouter} from './http-router';
import {HttpMethod} from './http-method.enum';
import path from 'path';
import {MiddlewareFunction, ControllerFunction} from './types';

export abstract class DefaultHttpPort implements ControllableHttpServerPort {
  protected port = 3000;

  getPort() {
    return this.port;
  }

  setPort(port: number) {
    this.port = port;
  }

  abstract register(
    method: HttpMethod,
    url: string,
    middlewareList: Array<MiddlewareFunction>,
    allowedMediaTypes: Array<string>,
    callback: ControllerFunction,
  ): void;

  abstract enableMiddleware(middleware: MiddlewareFunction): void;

  abstract enableSwaggerUi(
    path: string,
    swaggerUi: unknown,
    swaggerDocument: string,
  ): void;

  abstract startListening(): Promise<unknown>;

  abstract stopListening(): Promise<void>;

  setRouter(router: HttpRouter, basePath = '') {
    Object.keys(router).forEach(currentPath => {
      const route = router[currentPath];

      const routePath = path.posix.join(basePath, currentPath);

      const hasControllers = 'controllers' in route;
      const hasSubroutes = 'routes' in route;
      if (hasControllers && route.controllers)
        route.controllers.forEach(item => {
          const middlewareList = item.middlewareList ? item.middlewareList : [];
          this.register(
            item.method,
            routePath,
            middlewareList,
            item.allowedMediaTypes || [],
            item.controller as ControllerFunction,
          );
        });

      if (hasSubroutes && route.routes) this.setRouter(route.routes, routePath);
    });
  }
}
