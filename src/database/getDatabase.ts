import postgres from "postgres";
import { getConfiguration } from "../configuration/getConfiguration";

let database: postgres.Sql | undefined;

export function getDatabase(): postgres.Sql {
  if (!database) {
    database = postgres(getConfiguration().databaseUrl);
  }
  return database;
}
