import { getConfiguration } from "../configuration/getConfiguration";
import type { Branch } from "../types/Branch";
import { getJson } from "./getJson";
import { readCheckoutState } from "./readCheckoutState";
import { saveCheckoutState } from "./saveCheckoutState";

export async function startBranch(branchName: string): Promise<void> {
  const existingBranch = await getJson<Branch>(
    `${getConfiguration().serverUrl}/branches/${encodeURIComponent(branchName)}`,
  );
  if (existingBranch) {
    throw new Error(`branch ${branchName} already exists, use scion checkout ${branchName}`);
  }
  const checkoutState = await readCheckoutState();
  await saveCheckoutState({
    branchName,
    changesetId: checkoutState?.changesetId ?? null,
    isNewBranch: true,
    paths: checkoutState?.paths ?? [""],
    files: checkoutState?.files ?? [],
  });
  console.log(`started ${branchName}, it is created on your first commit`);
}
