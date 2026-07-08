create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  class_id text not null,
  class_title_snapshot text not null,
  submitted_at timestamptz not null default now(),
  student_name text,
  student_instagram text,
  rating_overall integer not null check (rating_overall between 1 and 5),
  best_part text not null,
  before_after_change text,
  recommended_for text not null,
  one_line_review text not null,
  detailed_review text,
  consent_public boolean not null default false,
  consent_contact boolean not null default false,
  is_featured boolean not null default false,
  status text not null default 'new' check (status in ('new', 'shortlisted', 'featured', 'archived')),
  admin_tags text[] not null default '{}',
  admin_summary_short text,
  admin_summary_long text
);

create index if not exists reviews_submitted_at_idx
  on public.reviews (submitted_at desc);

create index if not exists reviews_class_id_idx
  on public.reviews (class_id);

create index if not exists reviews_status_idx
  on public.reviews (status);
