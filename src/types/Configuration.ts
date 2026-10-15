export interface Configuration {
  databaseUrl: string;
  storageEndpoint: string;
  storageAccessKey: string;
  storageSecretKey: string;
  storageBucket: string;
  listenHost: string;
  serverPort: number;
  cachePort: number;
  serverUrl: string;
  cacheUrl: string;
  cacheSizeInBytes: number;
  objectFolder: string;
  authorName: string;
}
