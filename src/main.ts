import 'reflect-metadata';
import 'dotenv/config';
import {DependencyContainer} from 'tsyringe';
import {populateContainer} from './dependency-injection';
import {logger} from './infrastructure/logger/logger';
import {initializeEnv} from './infrastructure/constants';

void (async () => {
  logger.info('Loading config items from process.env');
  initializeEnv({...process.env});

  const container: DependencyContainer = populateContainer();
  const {bootstrap} = require('./application-bootstrap');
  const application = bootstrap(container);

  try {
    logger.info('Starting...');
    await application.run();
  } catch (applicationStartupError) {
    console.log(applicationStartupError);
    logger.error('Application failed to start');
    application.stop();
  }
})();
