import {inject, injectable} from 'tsyringe';
import {LoggerStepEnum, Types} from '../../types';
import {GoogleSheetsService} from '../../infrastructure/services/google/google-sheets';
import {google} from 'googleapis';
import {logger} from '../../infrastructure/logger/logger';

@injectable()
export class GoogleDriveGateway {
  constructor(
    @inject(Types.GOOGLE_SHEETS_SERVICE)
    private readonly googleSheetsService: GoogleSheetsService,
  ) {}

  async auth(): Promise<void> {
    const auth = await this.googleSheetsService.authorize();
    if (auth) {
      await this.googleSheetsService.saveCredentials(auth);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getSpreadsheet(spreadsheetId: string): Promise<any> {
    logger.info({
      message: 'Getting authorization',
      step: LoggerStepEnum.GET_GOOGLE_SHEETS_DATA,
      metadata: {
        spreadsheetId,
      },
    });

    const auth = await this.googleSheetsService.authorize();

    logger.info({
      message: 'Successfully authorized',
      step: LoggerStepEnum.GET_GOOGLE_SHEETS_DATA,
      metadata: {
        spreadsheetId,
        auth,
      },
    });

    logger.info({
      message: 'Getting spreadsheet data',
      step: LoggerStepEnum.GET_GOOGLE_SHEETS_DATA,
      metadata: {
        spreadsheetId,
        auth,
      },
    });

    const sheets = google.sheets({
      version: 'v4',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      auth: auth as any,
    });

    logger.info({
      message: 'Successfully got sheets',
      step: LoggerStepEnum.GET_GOOGLE_SHEETS_DATA,
      metadata: {
        spreadsheetId,
        auth,
        sheets,
      },
    });

    logger.info({
      message: 'Getting spreadsheet data',
      step: LoggerStepEnum.GET_GOOGLE_SHEETS_DATA,
      metadata: {
        spreadsheetId,
        auth,
        sheets,
      },
    });

    const response = await sheets.spreadsheets.get({
      spreadsheetId,
    });

    logger.info({
      message: 'Successfully got spreadsheet data',
      step: LoggerStepEnum.GET_GOOGLE_SHEETS_DATA,
      metadata: {
        spreadsheetId,
        auth,
        sheets,
        response,
      },
    });

    return response.data;
  }
}
