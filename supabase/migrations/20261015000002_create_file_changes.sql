create table file_changes (
  changeset_id text not null references changesets (id),
  path text not null,
  kind text not null check (kind in ('regular', 'executable', 'deleted')),
  blob_hash text,
  primary key (changeset_id, path),
  check ((kind = 'deleted') = (blob_hash is null))
);

alter table file_changes enable row level security;
