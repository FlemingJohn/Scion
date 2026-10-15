import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import type { CheckoutState } from "../types/CheckoutState";
import { checkoutStatePath } from "./checkoutStatePath";

export async function saveCheckoutState(checkoutState: CheckoutState): Promise<void> {
  await mkdir(dirname(checkoutStatePath), { recursive: true });
  await writeFile(checkoutStatePath, JSON.stringify(checkoutState, null, 2));
}
