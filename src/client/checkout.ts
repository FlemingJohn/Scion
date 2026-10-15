import { getConfiguration } from "../configuration/getConfiguration";
import { isValidPath } from "../paths/isValidPath";
import { makeFileMapFromFiles } from "../trees/makeFileMapFromFiles";
import type { Branch } from "../types/Branch";
import type { ChangesetId } from "../types/ChangesetId";
import type { FileEntry } from "../types/FileEntry";
import { collectFiles } from "./collectFiles";
import { findChangedFiles } from "./findChangedFiles";
import { getJson } from "./getJson";
import { readCheckoutState } from "./readCheckoutState";
import { removeStaleFiles } from "./removeStaleFiles";
import { saveCheckoutState } from "./saveCheckoutState";
import { writeWorkingFiles } from "./writeWorkingFiles";

export async function checkout(branchName: string, paths: string[]): Promise<void> {
  const branch = await getJson<Branch>(`${getConfiguration().serverUrl}/branches/${encodeURIComponent(branchName)}`);
  if (!branch) {
    throw new Error(`branch ${branchName} does not exist, use scion new ${branchName}`);
  }
  const previousState = await readCheckoutState();
  if (previousState && (await findChangedFiles(previousState)).length > 0) {
    throw new Error("this folder has uncommitted changes, commit them first");
  }
  const checkoutPaths = readCheckoutPaths(paths);
  const files = await collectAllFiles(branch.changesetId, checkoutPaths);
  await writeWorkingFiles(files);
  await removeStaleFiles(previousState?.files ?? [], files);
  await saveCheckoutState({ branchName, changesetId: branch.changesetId, isNewBranch: false, paths: checkoutPaths, files });
  console.log(`checked out ${files.length} files from ${branchName} at ${branch.changesetId.slice(0, 12)}`);
}

function readCheckoutPaths(paths: string[]): string[] {
  const checkoutPaths = paths.map((path) => path.replace(/\/+$/, ""));
  const invalidPath = checkoutPaths.find((path) => !isValidPath(path));
  if (invalidPath !== undefined) {
    throw new Error(`invalid path ${invalidPath}`);
  }
  return checkoutPaths.length > 0 ? checkoutPaths : [""];
}

async function collectAllFiles(changesetId: ChangesetId, folderPaths: string[]): Promise<FileEntry[]> {
  const fileLists = await Promise.all(folderPaths.map((folderPath) => collectFiles(changesetId, folderPath)));
  return [...makeFileMapFromFiles(fileLists.flat()).values()];
}
