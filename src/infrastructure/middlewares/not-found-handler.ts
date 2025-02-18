import {HttpStatusCode} from '../port/http/http-status-code';

export function notFoundHandler(request, response) {
  response
    .status(HttpStatusCode.NOT_FOUND)
    .send({status: HttpStatusCode.NOT_FOUND, result: 'not found'});
}
