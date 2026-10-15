import { getConfiguration } from "../configuration/getConfiguration";
import type { CachedObject } from "../types/CachedObject";

export async function getFromServer(path: string): Promise<CachedObject | null> {
  const response = await fetch(`${getConfiguration().serverUrl}${path}`);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`server answered ${response.status} for ${path}`);
  }
  return {
    body: Buffer.from(await response.arrayBuffer()),
    contentType: response.headers.get("content-type") ?? "application/octet-stream",
  };
}
