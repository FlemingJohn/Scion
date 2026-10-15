create table trees (
  changeset_id text not null references changesets (id),
  path text not null,
  entries jsonb not null,
  primary key (changeset_id, path)
);

alter table trees enable row level security;
