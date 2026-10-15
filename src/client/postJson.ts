import { checkResponse } from "./checkResponse";

export async function postJson<Result>(url: string, body: unknown): Promise<Result> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  await checkResponse(response);
  return (await response.json()) as Result;
}
