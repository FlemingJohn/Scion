import { findChangedFiles } from "./findChangedFiles";
import { requireCheckoutState } from "./requireCheckoutState";

export async function showStatus(): Promise<void> {
  const checkoutState = await requireCheckoutState();
  const fileChanges = await findChangedFiles(checkoutState);
  console.log(`on ${checkoutState.branchName} at ${checkoutState.changesetId?.slice(0, 12) ?? "nothing yet"}`);
  if (fileChanges.length === 0) {
    console.log("no changes");
  }
  for (const fileChange of fileChanges) {
    console.log(`${fileChange.kind === "deleted" ? "deleted" : "changed"}  ${fileChange.path}`);
  }
}
