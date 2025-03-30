import {Get, Produces, Request, Route, Tags} from 'tsoa';
import {Request as ExpressRequest} from 'express';
import {inject, singleton} from 'tsyringe';
import {HttpResponse} from '../port/http/http-response';
import {HttpStatusCode} from '../port/http/http-status-code';
import {LoggerStepEnum, Types} from '../../types';
import {GoogleDriveGateway} from '../../data/gateway/google-drive-gateway';
import {logger} from '../logger/logger';

@Route('google')
@Tags('Google')
@singleton()
export class GoogleController {
  constructor(
    @inject(Types.GOOGLE_DRIVE_GATEWAY)
    private readonly googleDriveGateway: GoogleDriveGateway,
  ) {}

  @Get('/sheet/{sheetId}')
  @Produces('application/json')
  async getSheetValues(
    @Request() req: ExpressRequest,
  ): Promise<HttpResponse<unknown>> {
    const {sheetId} = req.params;

    logger.info({
      message: 'Requesting getSheetValues from Google Drive gateway',
      step: LoggerStepEnum.GET_GOOGLE_SHEETS_DATA,
      metadata: {
        sheetId,
      },
    });

    const sheetValues = await this.googleDriveGateway.getSpreadsheet(sheetId);

    logger.info({
      message: 'Successfully retrieved sheet values',
      step: LoggerStepEnum.GET_GOOGLE_SHEETS_DATA,
      metadata: {
        sheetValues,
      },
    });

    return {
      status: HttpStatusCode.OK,
      result: {
        sheetValues: 'JSON.stringify(sheetValues)',
      },
    };
  }
}
