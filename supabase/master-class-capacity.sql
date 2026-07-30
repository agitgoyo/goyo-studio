-- Run in Supabase SQL Editor before deploying the application changes.
alter table public.classes add column if not exists class_type text not null default 'individual'
  check (class_type in ('individual', 'master'));

create table if not exists public.class_bundle_items (
  master_class_id text not null references public.classes(id) on delete restrict,
  member_class_id text not null references public.classes(id) on delete restrict,
  primary key (master_class_id, member_class_id),
  check (master_class_id <> member_class_id)
);

create table if not exists public.application_class_slots (
  application_id bigint not null references public.applications(id) on delete cascade,
  class_id text not null references public.classes(id) on delete restrict,
  primary key (application_id, class_id)
);
create index if not exists application_class_slots_class_id_idx on public.application_class_slots(class_id);
alter table public.applications add column if not exists reservation_expires_at timestamptz;

-- Returns the actual seats consumed by a purchasable class.  A master expands
-- to its member classes; an individual consumes itself.
create or replace function public.get_capacity(p_class_id text)
returns table(class_id text, capacity integer, occupied integer, remaining integer)
language sql stable security definer set search_path = public as $$
  with targets as (
    select c.id from classes c where c.id = p_class_id and c.class_type = 'individual'
    union
    select b.member_class_id from class_bundle_items b where b.master_class_id = p_class_id
  ), counts as (
    select s.class_id, count(*)::integer occupied from application_class_slots s
    join applications a on a.id = s.application_id
    where a.payment_status in ('paid','bank_pending')
       or (a.payment_status = 'payment_pending' and a.reservation_expires_at > now())
    group by s.class_id
  )
  select c.id, c.capacity::integer, coalesce(counts.occupied,0), greatest(c.capacity-coalesce(counts.occupied,0),0)
  from targets t join classes c on c.id=t.id left join counts on counts.class_id=c.id;
$$;

-- Creates one application and all its seat rows atomically.  Locks classes so
-- two requests cannot take the same final seat.
create or replace function public.create_application_with_slots(
  p_class_id text, p_name text, p_phone text, p_email text, p_class_type text,
  p_job text, p_level text, p_message text, p_status text, p_order_id text,
  p_amount numeric, p_method text, p_payment_key text default null, p_approved_at timestamptz default null
) returns bigint language plpgsql security definer set search_path = public as $$
declare v_id bigint; v_target text; v_exists integer;
begin
  perform 1 from classes where id=p_class_id and is_active for update;
  if not found then raise exception 'CLASS_NOT_FOUND'; end if;
  for v_target in select class_id from get_capacity(p_class_id) loop
    perform 1 from classes where id=v_target for update;
    select count(*) into v_exists from application_class_slots s join applications a on a.id=s.application_id
      where s.class_id=v_target and (a.payment_status in ('paid','bank_pending') or (a.payment_status='payment_pending' and a.reservation_expires_at > now()));
    if v_exists >= (select capacity from classes where id=v_target) then raise exception 'CLASS_FULL'; end if;
    if exists (select 1 from application_class_slots s join applications a on a.id=s.application_id
      where s.class_id=v_target and (a.payment_status in ('paid','bank_pending') or (a.payment_status='payment_pending' and a.reservation_expires_at > now()))
      and (a.email=p_email or a.phone=p_phone)) then raise exception 'DUPLICATE_APPLICATION'; end if;
  end loop;
  insert into applications(class_id,name,phone,email,class_type,job,level,message,payment_status,order_id,amount,method,payment_key,approved_at)
  values(p_class_id,p_name,p_phone,p_email,p_class_type,p_job,p_level,p_message,p_status,p_order_id,p_amount,p_method,p_payment_key,p_approved_at) returning id into v_id;
  insert into application_class_slots(application_id,class_id) select v_id,class_id from get_capacity(p_class_id);
  return v_id;
end $$;

create or replace function public.confirm_payment_reservation(
  p_order_id text, p_payment_key text, p_method text, p_approved_at timestamptz
) returns bigint language plpgsql security definer set search_path = public as $$
declare v_id bigint;
begin
  select id into v_id from applications where order_id=p_order_id for update;
  if not found then raise exception 'RESERVATION_NOT_FOUND'; end if;
  if exists (select 1 from applications where id=v_id and payment_status='paid') then return v_id; end if;
  if not exists (select 1 from applications where id=v_id and payment_status='payment_pending' and reservation_expires_at > now()) then raise exception 'RESERVATION_EXPIRED'; end if;
  update applications set payment_status='paid', payment_key=p_payment_key, method=p_method, approved_at=p_approved_at, reservation_expires_at=null where id=v_id;
  return v_id;
end $$;

-- Preview before backfill: rows listed here need manual classification as master.
select a.id, a.class_id, a.name, a.email from public.applications a
left join public.application_class_slots s on s.application_id=a.id where s.application_id is null;
-- Backfill after setting class_type and bundle items:
-- insert into application_class_slots(application_id,class_id)
-- select a.id, t.class_id from applications a cross join lateral get_capacity(a.class_id) t
-- on conflict do nothing;
