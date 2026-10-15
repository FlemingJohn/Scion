import type { ChangesetId } from "./ChangesetId";

export interface Branch {
  name: string;
  changesetId: ChangesetId;
}
