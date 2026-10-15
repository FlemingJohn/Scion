import { startClient } from "../client/startClient";

try {
  await startClient(process.argv);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
