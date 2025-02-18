import express, {Application, Request, Response, NextFunction} from 'express';
import {Server} from 'http';
import {injectable} from 'tsyringe';
import {HttpMethod} from '../http/http-method.enum';
import {HttpResponse} from '../http/http-response';
import {DefaultHttpPort} from '../http/default-http-port';
import {MiddlewareFunction, ControllerFunction} from '../http/types';
import {HttpStatusCode} from '../http/http-status-code';
import helmet from 'helmet';
import {logger} from '../../logger/logger';

@injectable()
export class ExpressHttpPort extends DefaultHttpPort {
  protected app: Application;
  private httpServer: Server | undefined;

  constructor() {
    super();
    this.app = express();
    this.app.use(helmet());
  }

  register(
    method: HttpMethod,
    url: string,
    middlewareList: Array<MiddlewareFunction>,
    allowedMediaTypes: Array<string>,
    controller: ControllerFunction,
  ) {
    const callback = async (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => {
      try {
        const params = url
          .split('/')
          .filter(piece => piece.indexOf(':') >= 0)
          .reduce((list: string[], param) => {
            const paramName = param.replace(':', '');
            list.push(req.params[paramName]);
            return list;
          }, []);

        let mediaTypeIsAllowed = true;
        if (allowedMediaTypes.length !== 0)
          mediaTypeIsAllowed = allowedMediaTypes
            .map(type => req.is(type))
            .reduce(
              (typeResult, state) => (state === false ? state : typeResult),
              true,
            );

        if (mediaTypeIsAllowed) {
          const result: HttpResponse<unknown> = await controller(
            req,
            res,
            next,
            ...params,
            req.body,
          );
          res.status(result.status).json(result);
        } else {
          res.status(HttpStatusCode.UNSUPPORTED_MEDIA_TYPE).json({
            status: HttpStatusCode.UNSUPPORTED_MEDIA_TYPE,
            result: `unsupported media type "${req.get('Content-Type')}"`,
          });
        }
      } catch (controllerExecutionError) {
        logger.error({
          message: 'Request failed to execute',
          step: 'ExpressHttpPort.register',
          metadata: {
            controllerExecutionError,
          },
        });

        logger.error('Request failed to execute', controllerExecutionError);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
          status: HttpStatusCode.INTERNAL_SERVER_ERROR,
          result: 'internal server error',
        });
      }
    };

    this.app[method](url, ...middlewareList, callback);
  }

  enableMiddleware(middleware: MiddlewareFunction) {
    this.app.use(middleware);
  }

  enableSwaggerUi(path: string, swaggerUi, swaggerDocument) {
    this.app.use(path, swaggerUi.serve, (req, res, next) => {
      swaggerUi.setup(swaggerDocument)(req, res, next);
    });
  }

  async startListening(): Promise<void> {
    logger.info('Listening to http port #' + this.getPort());
    return new Promise((resolve, reject) => {
      this.httpServer = this.app
        .listen(this.port, () => resolve())
        .on('error', reject);
    });
  }

  async stopListening(): Promise<void> {
    logger.info('Stopping http port #' + this.getPort());

    return new Promise(resolve => {
      this.httpServer.close();
      this.httpServer.closeAllConnections();
      logger.info('Listening stopped on http port #' + this.getPort());
      resolve();
    });
  }
}
