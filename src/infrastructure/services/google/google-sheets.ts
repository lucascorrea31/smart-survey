import {readFileSync, writeFileSync} from 'node:fs';
import {authenticate} from '@google-cloud/local-auth';
import {google} from 'googleapis';
import {injectable} from 'tsyringe';
import {logger} from '../../logger/logger';
import {FileReader} from '../../utils/file-reader';
import {GoogleCredentialsDto} from '../../../domain/dto/google-credentials.dto';

@injectable()
export class GoogleSheetsService {
  private readonly SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets.readonly',
  ];
  private readonly TOKEN_PATH = './token.json';
  private readonly CREDENTIALS_PATH = '../../../../credentials.json';

  constructor() {}

  async loadSavedCredentialsIfExist() {
    try {
      logger.info({
        message: 'Loading client secret file...',
        step: 'loadSavedCredentialsIfExist',
      });
      const googleCredentialsDto =
        await FileReader.readJSON<GoogleCredentialsDto>(this.TOKEN_PATH);

      logger.info({
        message: 'Successfully loaded client secret file',
        step: 'loadSavedCredentialsIfExist',
        metadata: {
          googleCredentials: googleCredentialsDto,
        },
      });

      return google.auth.fromJSON(googleCredentialsDto);
    } catch (err) {
      logger.error({
        message: 'Error loading client secret file:',
        metadata: {
          error: err,
        },
      });

      return null;
    }
  }

  async saveCredentials(client): Promise<void> {
    const content = JSON.stringify(readFileSync(this.CREDENTIALS_PATH));
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;

    const payload = JSON.stringify({
      type: 'authorized_user',
      client_id: key.client_id,
      client_secret: key.client_secret,
      refresh_token: client.credentials.refresh_token,
    });

    writeFileSync(this.TOKEN_PATH, payload);
  }

  async authorize() {
    const client = await this.loadSavedCredentialsIfExist();

    if (client) {
      return client;
    }

    const newClient = await authenticate({
      scopes: this.SCOPES,
      keyfilePath: this.CREDENTIALS_PATH,
    });

    if (newClient.credentials) {
      await this.saveCredentials(newClient);
    }

    return newClient;
  }
}
