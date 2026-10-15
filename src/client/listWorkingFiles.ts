import { readdir } from "node:fs/promises";
import { joinPath } from "../paths/joinPath";

const ignoredNames = [".scion", ".git", "node_modules"];

export async function listWorkingFiles(folderPath: string): Promise<string[]> {
  const entries = await readdir(folderPath === "" ? "." : folderPath, { withFileTypes: true }).catch(() => []);
  const paths: string[] = [];
  for (const entry of entries) {
    if (ignoredNames.includes(entry.name)) {
      continue;
    }
    const entryPath = joinPath(folderPath, entry.name);
    if (entry.isDirectory()) {
      paths.push(...(await listWorkingFiles(entryPath)));
    } else if (entry.isFile()) {
      paths.push(entryPath);
    }
  }
  return paths;
}
