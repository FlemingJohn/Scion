import { readFile } from "node:fs/promises";
import type { CheckoutState } from "../types/CheckoutState";
import { checkoutStatePath } from "./checkoutStatePath";

export async function readCheckoutState(): Promise<CheckoutState | null> {
  try {
    return JSON.parse(await readFile(checkoutStatePath, "utf8")) as CheckoutState;
  } catch {
    return null;
  }
}
