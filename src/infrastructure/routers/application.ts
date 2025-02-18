import {HttpRouter} from '../port/http/http-router';
import healthRouter from './health-router';

export const router: HttpRouter = {
  '/v1': {
    routes: {
      ...healthRouter,
    },
  },
};
