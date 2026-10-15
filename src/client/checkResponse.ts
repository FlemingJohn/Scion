export async function checkResponse(response: Response): Promise<void> {
  if (!response.ok) {
    throw new Error(`${response.status} from ${response.url}: ${await response.text()}`);
  }
}
