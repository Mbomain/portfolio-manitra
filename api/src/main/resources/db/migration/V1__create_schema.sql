create table key_figure (
  id       bigint generated always as identity primary key,
  position integer not null default 0,
  value    integer not null check (value >= 0),
  suffix   text,
  label    text    not null
);

create table experience (
  id           bigint generated always as identity primary key,
  position     integer not null default 0,
  role         text    not null,
  organization text    not null,
  period       text    not null,
  tag          text,
  summary      text,
  highlights   text[]  not null default '{}',
  technologies text[]  not null default '{}'
);

create table project (
  id           bigint generated always as identity primary key,
  position     integer not null default 0,
  title        text    not null,
  category     text    not null,
  period       text    not null,
  summary      text    not null,
  details      text,
  featured     boolean not null default false,
  technologies text[]  not null default '{}'
);

create table project_link (
  project_id bigint  not null references project (id) on delete cascade,
  position   integer not null,
  label      text    not null,
  url        text    not null,
  primary key (project_id, position)
);

create table skill (
  id       bigint generated always as identity primary key,
  position integer not null default 0,
  name     text    not null,
  category text,
  level    text check (level in ('ADVANCED', 'INTERMEDIATE'))
);

create table education (
  id          bigint generated always as identity primary key,
  position    integer not null default 0,
  degree      text    not null,
  school      text    not null,
  period      text    not null,
  description text
);

create table spoken_language (
  id          bigint generated always as identity primary key,
  position    integer not null default 0,
  name        text    not null,
  level       text    not null,
  proficiency integer not null check (proficiency between 0 and 100)
);

create table interest (
  id       bigint generated always as identity primary key,
  position integer not null default 0,
  label    text    not null,
  emoji    text
);

create table driving_license (
  id       bigint generated always as identity primary key,
  position integer not null default 0,
  label    text    not null,
  emoji    text
);
