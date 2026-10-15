export function joinPath(folderPath: string, name: string): string {
  return folderPath === "" ? name : `${folderPath}/${name}`;
}
