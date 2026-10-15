import { getConfiguration } from "../configuration/getConfiguration";
import { applyFileChanges } from "../trees/applyFileChanges";
import { makeFileMapFromFiles } from "../trees/makeFileMapFromFiles";
import type { BranchMoveResponse } from "../types/BranchMoveResponse";
import type { Changeset } from "../types/Changeset";
import type { CheckoutState } from "../types/CheckoutState";
import type { FileChange } from "../types/FileChange";
import type { FileEntry } from "../types/FileEntry";
import { findChangedFiles } from "./findChangedFiles";
import { postJson } from "./postJson";
import { requireCheckoutState } from "./requireCheckoutState";
import { saveCheckoutState } from "./saveCheckoutState";
import { uploadChangedFiles } from "./uploadChangedFiles";

export async function commit(message: string, author: string): Promise<void> {
  const serverUrl = getConfiguration().serverUrl;
  const checkoutState = await requireCheckoutState();
  const fileChanges = await findChangedFiles(checkoutState);
  if (fileChanges.length === 0) {
    console.log("nothing to commit");
    return;
  }
  await uploadChangedFiles(fileChanges);
  const changeset = await postJson<Changeset>(`${serverUrl}/changesets`, {
    parentId: checkoutState.changesetId,
    author,
    message,
    fileChanges,
  });
  const branchMove = await postJson<BranchMoveResponse>(
    `${serverUrl}/branches/${encodeURIComponent(checkoutState.branchName)}/move`,
    { expectedChangesetId: checkoutState.isNewBranch ? null : checkoutState.changesetId, newChangesetId: changeset.id },
  );
  if (branchMove.result === "conflict") {
    console.log(`${checkoutState.branchName} moved since your checkout, changeset ${changeset.id} was saved but not landed`);
    return;
  }
  await saveCheckoutState(makeStateAfterCommit(checkoutState, changeset, fileChanges));
  console.log(`landed ${changeset.id.slice(0, 12)} on ${checkoutState.branchName}`);
}

function makeStateAfterCommit(checkoutState: CheckoutState, changeset: Changeset, fileChanges: FileChange[]): CheckoutState {
  return { ...checkoutState, changesetId: changeset.id, isNewBranch: false, files: applyChanges(checkoutState.files, fileChanges) };
}

function applyChanges(files: FileEntry[], fileChanges: FileChange[]): FileEntry[] {
  const fileMap = makeFileMapFromFiles(files);
  applyFileChanges(fileMap, fileChanges);
  return [...fileMap.values()];
}
