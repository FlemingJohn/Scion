create table changesets (
  id text primary key,
  parent_id text references changesets (id),
  author text not null,
  author_date timestamptz not null,
  message text not null
);

create index changesets_parent_id_index on changesets (parent_id);

alter table changesets enable row level security;
