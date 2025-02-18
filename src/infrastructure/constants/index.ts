export class ConstantsApp {
  env: 'production' | 'stage' | 'development';
  debug: boolean;
  port: number;

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  constructor(props: any) {
    this.env = props.NODE_ENV;
    this.debug = props.DEBUG;
    this.port = isNaN(parseInt(props.PORT, 10))
      ? 3000
      : parseInt(props.PORT, 10);
  }
}

let Constants: ConstantsApp;

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export const initializeEnv: (props: any) => void = (props: any): void => {
  Constants = new ConstantsApp(props);
};

export const getEnv = (): ConstantsApp => Constants;
