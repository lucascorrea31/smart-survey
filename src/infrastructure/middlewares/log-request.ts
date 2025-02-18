import {logger} from '../logger/logger';

export function logRequest(request, response, next) {
  const requestStart = Date.now();

  response.on('finish', () => {
    if (ignoreLogRequest(request)) {
      return;
    }
    const requestFinish = Date.now();
    const timeElapsed = requestFinish - requestStart;

    const log = `${request.socket.remoteAddress} - ${request.method} ${request.originalUrl} ${response.statusCode} ${request.headers['content-length']} - ${timeElapsed}ms`;

    logger.info(log, {
      data: {
        request: {
          method: request.method,
          url: request.url,
          headers: request.headers,
        },
        response: {
          statusCode: response.statusCode,
          statusMessage: response.statusMessage,
          headers: response.headers,
        },
      },
      dataToShow: ['request.*', 'response.*'],
    });
  });

  next();
}

function ignoreLogRequest(request): boolean {
  const excludedRoutes = ['/swagger/?$', '/health/?$'];
  return new RegExp(excludedRoutes.join('|')).test(request.originalUrl);
}
