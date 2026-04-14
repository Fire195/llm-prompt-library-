-- ============================================================
-- T7: 创建数据库表
-- 在 Supabase Dashboard > SQL Editor 中执行此文件
-- ============================================================

-- 启用 UUID 扩展
create extension if not exists "uuid-ossp";

-- 分类表
create table if not exists categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  created_at timestamptz default now()
);

-- 提示词表
create table if not exists prompts (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  content text not null,
  description text,
  category_slug text references categories(slug) on delete set null,
  user_id uuid references auth.users(id) on delete cascade,
  is_public boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 收藏表
create table if not exists favorites (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  prompt_id uuid not null references prompts(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, prompt_id)
);

-- updated_at 自动更新触发器
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger prompts_updated_at
  before update on prompts
  for each row execute function update_updated_at();

-- ============================================================
-- 初始分类数据
-- ============================================================
insert into categories (name, slug) values
  ('写作', 'writing'),
  ('编程', 'coding'),
  ('翻译', 'translation'),
  ('分析', 'analysis'),
  ('创意', 'creative')
on conflict (slug) do nothing;
