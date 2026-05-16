-- initial schema for student complaint portal

-- profiles table for students and admins
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null check (role in ('student', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- complaints table
create table if not exists public.complaints (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text not null,
  category text not null,
  status text not null default 'pending' check (status in ('pending', 'in-progress', 'resolved', 'closed')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- enable row level security
alter table public.profiles enable row level security;
alter table public.complaints enable row level security;

-- profiles policies
create policy "anyone can view basic profile info" on public.profiles for select using (true);
create policy "users can update their own profile" on public.profiles for update using (auth.uid() = id);

-- complaints policies
create policy "students can view their own complaints" on public.complaints for select using (auth.uid() = student_id);
create policy "students can insert their own complaints" on public.complaints for insert with check (auth.uid() = student_id);
create policy "admins can view all complaints" on public.complaints for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "admins can update complaint status" on public.complaints for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- trigger for profiles
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', 'New User'),
    coalesce(new.raw_user_meta_data ->> 'role', 'student')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
