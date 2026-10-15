import type { ChangesetId } from "./ChangesetId";
import type { NewChangeset } from "./NewChangeset";

export interface Changeset extends NewChangeset {
  id: ChangesetId;
  authorDate: string;
}
