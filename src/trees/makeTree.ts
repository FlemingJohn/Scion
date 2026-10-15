import type { ChangesetId } from "../types/ChangesetId";
import type { FileEntry } from "../types/FileEntry";
import type { FileMap } from "../types/FileMap";
import type { Tree } from "../types/Tree";
import type { TreeEntry } from "../types/TreeEntry";

export function makeTree(changesetId: ChangesetId, fileMap: FileMap, path: string): Tree {
  const prefix = path === "" ? "" : `${path}/`;
  const entries = new Map<string, TreeEntry>();
  for (const fileEntry of fileMap.values()) {
    if (!fileEntry.path.startsWith(prefix)) {
      continue;
    }
    const [name, ...deeperParts] = fileEntry.path.slice(prefix.length).split("/");
    entries.set(name, deeperParts.length > 0 ? makeFolderEntry(name) : makeFileEntry(name, fileEntry));
  }
  return { changesetId, path, entries: [...entries.values()].sort(compareNames) };
}

function makeFolderEntry(name: string): TreeEntry {
  return { name, kind: "folder", blobHash: null };
}

function makeFileEntry(name: string, fileEntry: FileEntry): TreeEntry {
  return { name, kind: fileEntry.kind, blobHash: fileEntry.blobHash };
}

function compareNames(first: TreeEntry, second: TreeEntry): number {
  return first.name < second.name ? -1 : first.name > second.name ? 1 : 0;
}
