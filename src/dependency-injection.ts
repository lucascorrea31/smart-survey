import {DependencyContainer, container} from 'tsyringe';

import {Types} from './types';

import {Application} from './application';
import {ExpressHttpPort} from './infrastructure/port/express/express-http-port';
import {HealthController} from './infrastructure/controllers/health-controller';
import {GoogleDriveGateway} from './data/gateway/google-drive-gateway';
import {GoogleSheetsService} from './infrastructure/services/google/google-sheets';
import {GoogleController} from './infrastructure/controllers/google-controller';

export const populateContainer = (): DependencyContainer => {
  container.register(Types.APPLICATION, {useClass: Application});
  container.register(Types.HTTP_PORT, {useClass: ExpressHttpPort});

  // Gateway
  container.register(Types.GOOGLE_DRIVE_GATEWAY, {
    useClass: GoogleDriveGateway,
  });

  // Services
  container.register(Types.GOOGLE_SHEETS_SERVICE, {
    useClass: GoogleSheetsService,
  });

  // Controllers
  container.register(Types.HEALTH_CONTROLLER, {useClass: HealthController});
  container.register(Types.GOOGLE_CONTROLLER, {useClass: GoogleController});

  // Usecases
  // container.register(Types.CREATE_PERSON_USECASE, {
  // 	useClass: CreatePersonUseCase,
  // });

  return container;
};
