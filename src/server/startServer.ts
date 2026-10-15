import Fastify from "fastify";
import { makeBucketIfMissing } from "../blobs/makeBucketIfMissing";
import { getConfiguration } from "../configuration/getConfiguration";
import { acceptBinaryBodies } from "./acceptBinaryBodies";
import { handleCreateChangeset } from "./handleCreateChangeset";
import { handleGetBlob } from "./handleGetBlob";
import { handleGetBranch } from "./handleGetBranch";
import { handleGetChangeset } from "./handleGetChangeset";
import { handleGetDiff } from "./handleGetDiff";
import { handleGetHistory } from "./handleGetHistory";
import { handleGetTree } from "./handleGetTree";
import { handleMoveBranch } from "./handleMoveBranch";
import { handlePutBlob } from "./handlePutBlob";

export async function startServer(): Promise<void> {
  const configuration = getConfiguration();
  const server = Fastify({ logger: true });
  acceptBinaryBodies(server);
  await makeBucketIfMissing();

  server.post("/blobs", handlePutBlob);
  server.get("/blobs/:blobHash", handleGetBlob);
  server.post("/changesets", handleCreateChangeset);
  server.get("/changesets/:changesetId", handleGetChangeset);
  server.get("/changesets/:changesetId/history", handleGetHistory);
  server.get("/changesets/:changesetId/tree", handleGetTree);
  server.get("/diffs/:fromChangesetId/:toChangesetId", handleGetDiff);
  server.get("/branches/:branchName", handleGetBranch);
  server.post("/branches/:branchName/move", handleMoveBranch);

  await server.listen({ host: configuration.listenHost, port: configuration.serverPort });
}
