export enum Types {
  APPLICATION = 'Ppplication',
  HTTP_PORT = 'HttpPort',

  // Gateways
  GOOGLE_DRIVE_GATEWAY = 'GoogleDriveGateway',

  // Services
  GOOGLE_SHEETS_SERVICE = 'GoogleSheetsService',

  // Controllers
  HEALTH_CONTROLLER = 'HealthController',
  GOOGLE_CONTROLLER = 'GoogleController',
}

export enum LoggerStepEnum {
  GET_GOOGLE_SHEETS_DATA = 'GET_GOOGLE_SHEETS_DATA',
}

export interface JWTInput {
  type?: string;
  client_email?: string;
  private_key?: string;
  private_key_id?: string;
  project_id?: string;
  client_id?: string;
  client_secret?: string;
  refresh_token?: string;
  quota_project_id?: string;
}

/**
 * E-mail type
 * @pattern: ^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$
 */
export type Email = string;
