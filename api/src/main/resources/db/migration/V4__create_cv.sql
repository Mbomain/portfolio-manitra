-- The downloadable CV: a single PDF, replaced from the back office.
create table cv (
  id         integer     primary key default 1 check (id = 1),
  file_name  text        not null,
  content    bytea       not null,
  updated_at timestamptz not null default now()
);
