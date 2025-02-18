import {HttpRouteDefinition} from './http-route-definition';

export interface HttpRouter {
  [path: string]: {
    controllers?: Array<HttpRouteDefinition>;
    routes?: HttpRouter;
  };
}
