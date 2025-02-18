import {Get, Route} from 'tsoa';
import {singleton} from 'tsyringe';
import {HttpResponse} from '../port/http/http-response';
import {HttpStatusCode} from '../port/http/http-status-code';

@Route('health')
@singleton()
export class HealthController {
  @Get('/')
  async getHealth(): Promise<HttpResponse<string>> {
    return {
      status: HttpStatusCode.OK,
      result: 'everything is fine',
    };
  }
}
