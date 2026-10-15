import type { CheckoutState } from "../types/CheckoutState";
import { readCheckoutState } from "./readCheckoutState";

export async function requireCheckoutState(): Promise<CheckoutState> {
  const checkoutState = await readCheckoutState();
  if (!checkoutState) {
    throw new Error("this folder is not a checkout, run scion checkout or scion new first");
  }
  return checkoutState;
}
