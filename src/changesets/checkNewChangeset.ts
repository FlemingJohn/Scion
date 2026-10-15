import { findMissingBlobs } from "../blobs/findMissingBlobs";
import { isBlobHash } from "../blobs/isBlobHash";
import { makeBadRequestError } from "../errors/makeBadRequestError";
import { isValidPath } from "../paths/isValidPath";
import type { FileChange } from "../types/FileChange";
import type { NewChangeset } from "../types/NewChangeset";
import { hasChangeset } from "./hasChangeset";

const fileChangeKinds = ["regular", "executable", "deleted"];

export async function checkNewChangeset(newChangeset: NewChangeset): Promise<void> {
  if (!newChangeset.author || !newChangeset.message) {
    throw makeBadRequestError("a changeset needs an author and a message");
  }
  checkFileChanges(newChangeset.fileChanges);
  if (newChangeset.parentId !== null && !(await hasChangeset(newChangeset.parentId))) {
    throw makeBadRequestError(`parent ${newChangeset.parentId} does not exist`);
  }
  const missingBlobs = await findMissingBlobs(newChangeset.fileChanges);
  if (missingBlobs.length > 0) {
    throw makeBadRequestError(`missing blobs: ${missingBlobs.join(", ")}`);
  }
}

function checkFileChanges(fileChanges: FileChange[]): void {
  if (!Array.isArray(fileChanges) || fileChanges.length === 0) {
    throw makeBadRequestError("a changeset needs at least one file change");
  }
  const paths = new Set(fileChanges.map((fileChange) => fileChange.path));
  if (paths.size !== fileChanges.length) {
    throw makeBadRequestError("a path can only change once in a changeset");
  }
  const invalidChange = fileChanges.find((fileChange) => !isValidFileChange(fileChange));
  if (invalidChange) {
    throw makeBadRequestError(`invalid file change for ${invalidChange.path}`);
  }
}

function isValidFileChange(fileChange: FileChange): boolean {
  if (!isValidPath(fileChange.path) || !fileChangeKinds.includes(fileChange.kind)) {
    return false;
  }
  if (fileChange.kind === "deleted") {
    return fileChange.blobHash === null;
  }
  return fileChange.blobHash !== null && isBlobHash(fileChange.blobHash);
}
