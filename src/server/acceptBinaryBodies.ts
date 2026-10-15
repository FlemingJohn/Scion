import type { FastifyInstance } from "fastify";

const largestBlobInBytes = 100 * 1024 * 1024;

export function acceptBinaryBodies(server: FastifyInstance): void {
  server.addContentTypeParser(
    "application/octet-stream",
    { parseAs: "buffer", bodyLimit: largestBlobInBytes },
    (_request, body, done) => done(null, body),
  );
}
