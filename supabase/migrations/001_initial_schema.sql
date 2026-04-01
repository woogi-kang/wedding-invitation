-- WeddingCraft SaaS 초기 스키마
-- 멀티테넌트 청첩장 서비스를 위한 DB 구조

-- ============================================================
-- 1. profiles (Supabase Auth 확장)
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- Auth 유저 생성 시 자동으로 profile 생성
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- 2. invitations (청첩장)
-- ============================================================
create type public.invitation_status as enum ('draft', 'published', 'expired');
create type public.invitation_tier as enum ('basic', 'premium', 'arcade');

create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  slug text unique not null,
  title text not null default '',
  status public.invitation_status not null default 'draft',
  tier public.invitation_tier not null default 'basic',

  -- 섹션/테마 설정
  sections_config jsonb not null default '[]'::jsonb,
  theme_config jsonb not null default '{}'::jsonb,

  -- 결혼식 정보
  wedding_date timestamptz,
  venue_name text,
  venue_address text,
  venue_lat double precision,
  venue_lng double precision,

  -- 신랑/신부 정보
  groom_name text,
  bride_name text,
  groom_phone text,
  bride_phone text,

  -- 혼주 정보
  groom_father text,
  groom_mother text,
  bride_father text,
  bride_mother text,

  -- 계좌 정보
  groom_account jsonb default '[]'::jsonb,
  bride_account jsonb default '[]'::jsonb,

  -- 발행/만료
  published_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_invitations_user_id on public.invitations(user_id);
create index idx_invitations_slug on public.invitations(slug);
create index idx_invitations_status on public.invitations(status);

-- updated_at 자동 갱신 트리거
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_invitations_updated_at
  before update on public.invitations
  for each row execute function public.set_updated_at();

-- ============================================================
-- 3. section_data (섹션별 커스텀 데이터)
-- ============================================================
create table public.section_data (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  section_type text not null,
  enabled boolean not null default true,
  sort_order integer not null default 0,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_section_data_invitation on public.section_data(invitation_id);
create unique index idx_section_data_unique on public.section_data(invitation_id, section_type);

create trigger set_section_data_updated_at
  before update on public.section_data
  for each row execute function public.set_updated_at();

-- ============================================================
-- 4. guestsnap_sessions (GuestSnap 세션)
-- ============================================================
create table public.guestsnap_sessions (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  guest_name text not null,
  folder_id text,
  upload_count integer not null default 0,
  total_size_bytes bigint not null default 0,
  created_at timestamptz not null default now(),
  expires_at timestamptz
);

create index idx_guestsnap_sessions_invitation on public.guestsnap_sessions(invitation_id);

-- ============================================================
-- 5. guestsnap_files (GuestSnap 파일)
-- ============================================================
create type public.guestsnap_file_type as enum ('image', 'video');
create type public.guestsnap_file_status as enum ('uploading', 'uploaded', 'failed');

create table public.guestsnap_files (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.guestsnap_sessions(id) on delete cascade,
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  file_name text not null,
  file_type public.guestsnap_file_type not null,
  file_size_bytes bigint not null default 0,
  storage_path text not null,
  status public.guestsnap_file_status not null default 'uploading',
  created_at timestamptz not null default now()
);

create index idx_guestsnap_files_session on public.guestsnap_files(session_id);
create index idx_guestsnap_files_invitation on public.guestsnap_files(invitation_id);

-- ============================================================
-- 6. afterparty_places (AfterParty 장소)
-- ============================================================
create type public.afterparty_category as enum ('afterparty', 'restaurant', 'cafe', 'event', 'photospot');

create table public.afterparty_places (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  category public.afterparty_category not null default 'afterparty',
  name text not null,
  description text,
  place_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index idx_afterparty_places_invitation on public.afterparty_places(invitation_id);

-- ============================================================
-- 7. orders (주문/결제)
-- ============================================================
create type public.payment_status as enum ('pending', 'paid', 'refunded');

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  invitation_id uuid references public.invitations(id) on delete set null,
  tier public.invitation_tier not null,
  amount integer not null default 0,
  payment_key text,
  payment_status public.payment_status not null default 'pending',
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create index idx_orders_user_id on public.orders(user_id);
create index idx_orders_invitation_id on public.orders(invitation_id);

-- ============================================================
-- 8. rsvp_responses (RSVP 응답)
-- ============================================================
create type public.rsvp_attending as enum ('yes', 'no', 'maybe');

create table public.rsvp_responses (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  guest_name text not null,
  guest_phone text,
  attending public.rsvp_attending not null default 'yes',
  party_size integer not null default 1,
  meal_type text,
  message text,
  created_at timestamptz not null default now()
);

create index idx_rsvp_responses_invitation on public.rsvp_responses(invitation_id);

-- ============================================================
-- 9. analytics_events (통계 이벤트)
-- ============================================================
create table public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  event_type text not null,
  event_data jsonb default '{}'::jsonb,
  ip_hash text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index idx_analytics_events_invitation on public.analytics_events(invitation_id);
create index idx_analytics_events_type on public.analytics_events(event_type);
create index idx_analytics_events_created on public.analytics_events(created_at);

-- ============================================================
-- RLS (Row Level Security) 정책
-- ============================================================

-- profiles
alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- invitations
alter table public.invitations enable row level security;

create policy "invitations_select_own" on public.invitations
  for select using (auth.uid() = user_id);

create policy "invitations_select_published" on public.invitations
  for select using (status = 'published');

create policy "invitations_insert_own" on public.invitations
  for insert with check (auth.uid() = user_id);

create policy "invitations_update_own" on public.invitations
  for update using (auth.uid() = user_id);

create policy "invitations_delete_own" on public.invitations
  for delete using (auth.uid() = user_id);

-- section_data
alter table public.section_data enable row level security;

create policy "section_data_select_own" on public.section_data
  for select using (
    exists (
      select 1 from public.invitations
      where id = section_data.invitation_id and user_id = auth.uid()
    )
  );

create policy "section_data_select_published" on public.section_data
  for select using (
    exists (
      select 1 from public.invitations
      where id = section_data.invitation_id and status = 'published'
    )
  );

create policy "section_data_insert_own" on public.section_data
  for insert with check (
    exists (
      select 1 from public.invitations
      where id = section_data.invitation_id and user_id = auth.uid()
    )
  );

create policy "section_data_update_own" on public.section_data
  for update using (
    exists (
      select 1 from public.invitations
      where id = section_data.invitation_id and user_id = auth.uid()
    )
  );

create policy "section_data_delete_own" on public.section_data
  for delete using (
    exists (
      select 1 from public.invitations
      where id = section_data.invitation_id and user_id = auth.uid()
    )
  );

-- guestsnap_sessions
alter table public.guestsnap_sessions enable row level security;

create policy "guestsnap_sessions_select_own" on public.guestsnap_sessions
  for select using (
    exists (
      select 1 from public.invitations
      where id = guestsnap_sessions.invitation_id and user_id = auth.uid()
    )
  );

create policy "guestsnap_sessions_insert_public" on public.guestsnap_sessions
  for insert with check (
    exists (
      select 1 from public.invitations
      where id = guestsnap_sessions.invitation_id and status = 'published'
    )
  );

-- guestsnap_files
alter table public.guestsnap_files enable row level security;

create policy "guestsnap_files_select_own" on public.guestsnap_files
  for select using (
    exists (
      select 1 from public.invitations
      where id = guestsnap_files.invitation_id and user_id = auth.uid()
    )
  );

create policy "guestsnap_files_insert_public" on public.guestsnap_files
  for insert with check (
    exists (
      select 1 from public.invitations
      where id = guestsnap_files.invitation_id and status = 'published'
    )
  );

-- afterparty_places
alter table public.afterparty_places enable row level security;

create policy "afterparty_select_own" on public.afterparty_places
  for select using (
    exists (
      select 1 from public.invitations
      where id = afterparty_places.invitation_id and user_id = auth.uid()
    )
  );

create policy "afterparty_select_published" on public.afterparty_places
  for select using (
    exists (
      select 1 from public.invitations
      where id = afterparty_places.invitation_id and status = 'published'
    )
  );

create policy "afterparty_insert_own" on public.afterparty_places
  for insert with check (
    exists (
      select 1 from public.invitations
      where id = afterparty_places.invitation_id and user_id = auth.uid()
    )
  );

create policy "afterparty_update_own" on public.afterparty_places
  for update using (
    exists (
      select 1 from public.invitations
      where id = afterparty_places.invitation_id and user_id = auth.uid()
    )
  );

create policy "afterparty_delete_own" on public.afterparty_places
  for delete using (
    exists (
      select 1 from public.invitations
      where id = afterparty_places.invitation_id and user_id = auth.uid()
    )
  );

-- orders
alter table public.orders enable row level security;

create policy "orders_select_own" on public.orders
  for select using (auth.uid() = user_id);

create policy "orders_insert_own" on public.orders
  for insert with check (auth.uid() = user_id);

-- rsvp_responses
alter table public.rsvp_responses enable row level security;

create policy "rsvp_insert_public" on public.rsvp_responses
  for insert with check (
    exists (
      select 1 from public.invitations
      where id = rsvp_responses.invitation_id and status = 'published'
    )
  );

create policy "rsvp_select_own" on public.rsvp_responses
  for select using (
    exists (
      select 1 from public.invitations
      where id = rsvp_responses.invitation_id and user_id = auth.uid()
    )
  );

-- analytics_events
alter table public.analytics_events enable row level security;

create policy "analytics_insert_public" on public.analytics_events
  for insert with check (
    exists (
      select 1 from public.invitations
      where id = analytics_events.invitation_id and status = 'published'
    )
  );

create policy "analytics_select_own" on public.analytics_events
  for select using (
    exists (
      select 1 from public.invitations
      where id = analytics_events.invitation_id and user_id = auth.uid()
    )
  );
