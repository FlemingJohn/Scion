import { getConfiguration } from "../configuration/getConfiguration";
import type { Changeset } from "../types/Changeset";
import { getJson } from "./getJson";
import { requireCheckoutState } from "./requireCheckoutState";

export async function showLog(limit: number): Promise<void> {
  const checkoutState = await requireCheckoutState();
  if (!checkoutState.changesetId) {
    console.log("no history yet");
    return;
  }
  const url = `${getConfiguration().serverUrl}/changesets/${checkoutState.changesetId}/history?limit=${limit}`;
  const history = (await getJson<Changeset[]>(url)) ?? [];
  for (const changeset of history) {
    console.log(`${changeset.id.slice(0, 12)}  ${changeset.authorDate}  ${changeset.author}`);
    console.log(`    ${changeset.message}`);
  }
}
