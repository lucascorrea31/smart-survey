import {DependencyContainer, container} from 'tsyringe';

import {Types} from './types';

import {Application} from './application';
import {ExpressHttpPort} from './infrastructure/port/express/express-http-port';
import {HealthController} from './infrastructure/controllers/health-controller';

export const populateContainer = (): DependencyContainer => {
  container.register(Types.APPLICATION, {useClass: Application});
  container.register(Types.HTTP_PORT, {useClass: ExpressHttpPort});

  // Gateway
  // container.register(Types.PARTY_SERVICE_GATEWAY, {
  // 	useClass: PartyServiceGateway,
  // });

  // Controllers
  container.register(Types.HEALTH_CONTROLLER, {useClass: HealthController});

  // Usecases
  // container.register(Types.CREATE_PERSON_USECASE, {
  // 	useClass: CreatePersonUseCase,
  // });

  return container;
};
