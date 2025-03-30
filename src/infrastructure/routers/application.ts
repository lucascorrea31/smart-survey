import {HttpRouter} from '../port/http/http-router';
import healthRouter from './health-router';
import googleRouter from './google-router';

export const router: HttpRouter = {
  '/v1': {
    routes: {
      ...healthRouter,
      ...googleRouter,
    },
  },
};
