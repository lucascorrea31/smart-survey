import {Application} from './application';
import {ControllableHttpServerPort} from './infrastructure/port/http/controllable-http-server-port';
import {router} from './infrastructure/routers/application';
import {
  logRequest,
  notFoundHandler,
  sanitizeRequest,
} from './infrastructure/middlewares';
import {DependencyContainer} from 'tsyringe';
import {Types} from './types';
import {getEnv} from './infrastructure/constants';
import * as swaggerUi from 'swagger-ui-express';
import {swaggerRouterData} from './infrastructure/swagger/api-version-data';
import {logger} from './infrastructure/logger/logger';

export const bootstrap = (container: DependencyContainer): Application => {
  logger.info('Initializing...');

  const application = container.resolve<Application>(Types.APPLICATION);
  const httpPortA = container.resolve<ControllableHttpServerPort>(
    Types.HTTP_PORT,
  );

  console.log(getEnv());

  httpPortA.setPort(getEnv().port);

  httpPortA.enableMiddleware(sanitizeRequest);
  httpPortA.enableMiddleware(logRequest);

  httpPortA.setRouter(router, '/smart-survey');

  const isProductionEnvironment = getEnv().env === 'production';

  if (!isProductionEnvironment) {
    swaggerRouterData?.forEach(version => {
      const swaggerDocument = require(version.swaggerDocument);
      httpPortA.enableSwaggerUi(
        version.swaggerPath,
        swaggerUi,
        swaggerDocument,
      );
    });
  }

  // Must be placed after all http modules
  httpPortA.enableMiddleware(notFoundHandler);

  application.addHttpPort(httpPortA);

  return application;
};
