-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users Table
create table if not exists public.users (
  id uuid references auth.users on delete cascade primary key,
  email text unique,
  full_name text,
  avatar_url text,
  business_type text,
  business_size text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_login timestamp with time zone,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Levels Table
create table if not exists public.levels (
  id uuid default uuid_generate_v4() primary key,
  order_number integer not null unique,
  title text not null,
  description text,
  thumbnail_url text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Videos Table
create table if not exists public.videos (
  id uuid default uuid_generate_v4() primary key,
  level_id uuid references public.levels on delete cascade not null,
  order_number integer not null,
  title text not null,
  url text not null,
  duration integer,
  thumbnail_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(level_id, order_number)
);

-- Artifacts Table
create table if not exists public.artifacts (
  id uuid default uuid_generate_v4() primary key,
  level_id uuid references public.levels on delete cascade not null,
  title text not null,
  description text,
  file_url text not null,
  file_type text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Skills Table
create table if not exists public.skills (
  id uuid default uuid_generate_v4() primary key,
  name text not null unique,
  description text,
  category text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- User Skills Table
create table if not exists public.user_skills (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users on delete cascade not null,
  skill_id uuid references public.skills on delete cascade not null,
  proficiency_level integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, skill_id)
);

-- Progress Table
create table if not exists public.progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users on delete cascade not null,
  level_id uuid references public.levels on delete cascade not null,
  status text not null check (status in ('not_started', 'in_progress', 'completed')),
  completed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, level_id)
);

-- Achievements Table
create table if not exists public.achievements (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  badge_url text,
  criteria jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- User Achievements Table
create table if not exists public.user_achievements (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users on delete cascade not null,
  achievement_id uuid references public.achievements on delete cascade not null,
  achieved_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, achievement_id)
);

-- Enable Row Level Security
alter table public.users enable row level security;
alter table public.levels enable row level security;
alter table public.videos enable row level security;
alter table public.artifacts enable row level security;
alter table public.skills enable row level security;
alter table public.user_skills enable row level security;
alter table public.progress enable row level security;
alter table public.achievements enable row level security;
alter table public.user_achievements enable row level security;

-- RLS Policies

-- Users policies
create policy "Users can view their own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.users for update
  using (auth.uid() = id);

-- Levels policies
create policy "Anyone can view active levels"
  on public.levels for select
  using (is_active = true);

-- Videos policies
create policy "Anyone can view videos of active levels"
  on public.videos for select
  using (
    exists (
      select 1 from public.levels
      where levels.id = videos.level_id
      and levels.is_active = true
    )
  );

-- Artifacts policies
create policy "Anyone can view artifacts of active levels"
  on public.artifacts for select
  using (
    exists (
      select 1 from public.levels
      where levels.id = artifacts.level_id
      and levels.is_active = true
    )
  );

-- Skills policies
create policy "Anyone can view skills"
  on public.skills for select
  using (true);

-- User Skills policies
create policy "Users can view their own skills"
  on public.user_skills for select
  using (auth.uid() = user_id);

create policy "Users can update their own skills"
  on public.user_skills for update
  using (auth.uid() = user_id);

create policy "Users can insert their own skills"
  on public.user_skills for insert
  with check (auth.uid() = user_id);

-- Progress policies
create policy "Users can view their own progress"
  on public.progress for select
  using (auth.uid() = user_id);

create policy "Users can update their own progress"
  on public.progress for update
  using (auth.uid() = user_id);

create policy "Users can insert their own progress"
  on public.progress for insert
  with check (auth.uid() = user_id);

-- Achievements policies
create policy "Anyone can view achievements"
  on public.achievements for select
  using (true);

-- User Achievements policies
create policy "Users can view their own achievements"
  on public.user_achievements for select
  using (auth.uid() = user_id);

-- Functions and Triggers

-- Updated at trigger function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create updated_at triggers for all tables
create trigger handle_updated_at
  before update on public.users
  for each row
  execute function public.handle_updated_at();

create trigger handle_updated_at
  before update on public.levels
  for each row
  execute function public.handle_updated_at();

create trigger handle_updated_at
  before update on public.videos
  for each row
  execute function public.handle_updated_at();

create trigger handle_updated_at
  before update on public.artifacts
  for each row
  execute function public.handle_updated_at();

create trigger handle_updated_at
  before update on public.skills
  for each row
  execute function public.handle_updated_at();

create trigger handle_updated_at
  before update on public.user_skills
  for each row
  execute function public.handle_updated_at();

create trigger handle_updated_at
  before update on public.progress
  for each row
  execute function public.handle_updated_at();

create trigger handle_updated_at
  before update on public.achievements
  for each row
  execute function public.handle_updated_at();

-- Handle new user registration
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user registration
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user(); 