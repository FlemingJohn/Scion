export function isValidPath(path: string): boolean {
  if (path === "" || path.startsWith("/") || path.includes("\\")) {
    return false;
  }
  return path.split("/").every(isValidPathPart);
}

function isValidPathPart(part: string): boolean {
  return part !== "" && part !== "." && part !== ".." && !part.includes(":");
}
