export interface GoogleCredentials {
  installed: {
    clientId: string;
    projectId: string;
    authUri: string;
    tokenUri: string;
    authProviderX509CertUrl: string;
    clientSecret: string;
    redirectUris: string[];
  };
}
