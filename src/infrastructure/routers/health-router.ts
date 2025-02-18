import {container} from 'tsyringe';
import {HttpRouter} from '../port/http/http-router';
import {HttpMethod} from '../port/http/http-method.enum';

import {Types} from '../../types';
import {HealthController} from '../controllers/health-controller';

const healthController = container.resolve<HealthController>(
  Types.HEALTH_CONTROLLER,
);

const router: HttpRouter = {
  '/health': {
    controllers: [
      {
        method: HttpMethod.GET,
        controller: healthController.getHealth,
        middlewareList: [],
      },
    ],
  },
};

export default router;
