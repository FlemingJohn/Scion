create table branches (
  name text primary key,
  changeset_id text not null references changesets (id)
);

alter table branches enable row level security;
