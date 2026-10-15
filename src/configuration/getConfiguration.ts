import { existsSync } from "node:fs";
import { homedir, userInfo } from "node:os";
import { join } from "node:path";
import type { Configuration } from "../types/Configuration";

let configuration: Configuration | undefined;

export function getConfiguration(): Configuration {
  if (!configuration) {
    loadEnvironmentFile();
    configuration = readConfiguration(process.env);
  }
  return configuration;
}

function loadEnvironmentFile(): void {
  if (existsSync(".env")) {
    process.loadEnvFile(".env");
  }
}

function readConfiguration(environment: NodeJS.ProcessEnv): Configuration {
  return {
    databaseUrl: environment.DATABASE_URL ?? "postgresql://postgres:postgres@127.0.0.1:54322/postgres",
    storageEndpoint: environment.STORAGE_ENDPOINT ?? "http://127.0.0.1:9000",
    storageAccessKey: environment.STORAGE_ACCESS_KEY ?? "minioadmin",
    storageSecretKey: environment.STORAGE_SECRET_KEY ?? "minioadmin",
    storageBucket: environment.STORAGE_BUCKET ?? "scion-blobs",
    listenHost: environment.LISTEN_HOST ?? "127.0.0.1",
    serverPort: Number(environment.SERVER_PORT ?? 4000),
    cachePort: Number(environment.CACHE_PORT ?? 4001),
    serverUrl: environment.SERVER_URL ?? "http://127.0.0.1:4000",
    cacheUrl: environment.CACHE_URL ?? "http://127.0.0.1:4001",
    cacheSizeInBytes: Number(environment.CACHE_SIZE_IN_BYTES ?? 512 * 1024 * 1024),
    objectFolder: environment.OBJECT_FOLDER ?? join(homedir(), ".scion", "objects"),
    authorName: environment.SCION_AUTHOR ?? userInfo().username,
  };
}
