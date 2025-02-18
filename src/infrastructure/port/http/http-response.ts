import {HttpStatusCode} from './http-status-code';
export interface HttpResponse<T> {
  status: HttpStatusCode;
  result: T;
}
