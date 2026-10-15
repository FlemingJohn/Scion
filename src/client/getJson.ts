import { checkResponse } from "./checkResponse";

export async function getJson<Result>(url: string): Promise<Result | null> {
  const response = await fetch(url);
  if (response.status === 404) {
    return null;
  }
  await checkResponse(response);
  return (await response.json()) as Result;
}
