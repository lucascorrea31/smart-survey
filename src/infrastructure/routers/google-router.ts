import {container} from 'tsyringe';
import {HttpRouter} from '../port/http/http-router';
import {HttpMethod} from '../port/http/http-method.enum';

import {Types} from '../../types';
import {GoogleController} from '../controllers/google-controller';

const googleController = container.resolve<GoogleController>(
  Types.GOOGLE_CONTROLLER,
);

const router: HttpRouter = {
  '/google': {
    routes: {
      '/sheet': {
        routes: {
          '/:sheetId': {
            controllers: [
              {
                method: HttpMethod.GET,
                controller:
                  googleController.getSheetValues.bind(googleController),
                middlewareList: [],
              },
            ],
          },
        },
      },
    },
  },
};

export default router;
