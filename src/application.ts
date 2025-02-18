import {injectable} from 'tsyringe';
import {ControllableHttpServerPort} from './infrastructure/port/http/controllable-http-server-port';
import {logger} from './infrastructure/logger/logger';

@injectable()
export class Application {
  private httpPorts: ControllableHttpServerPort[] = [];

  constructor() {
    this.httpPorts = [];
  }

  addHttpPort(httpPort: ControllableHttpServerPort) {
    this.httpPorts.push(httpPort);
  }

  async run() {
    logger.info('Starting http ports...');
    if (this.httpPorts.length > 0) {
      for (const httpPort of this.httpPorts) {
        await httpPort.startListening();
      }
    } else {
      logger.info('No http ports found.');
    }

    logger.info('Started successfully.');
  }

  async stop() {
    logger.info('Stopping http ports...');
    if (this.httpPorts.length > 0)
      for (const httpPort of this.httpPorts) {
        try {
          await httpPort.stopListening();
          logger.info('Stopped successfully');
        } catch (httpPortStopError) {
          logger.error('Port failed to stop', httpPortStopError);
        }
      }

    logger.info('Stopped successfully');

    // eslint-disable-next-line
    process.exit(0);
  }
}
