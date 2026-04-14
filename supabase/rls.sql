-- ============================================================
-- T8: Row Level Security (RLS) 策略
-- 在 Supabase Dashboard > SQL Editor 中执行此文件
-- ============================================================

-- 开启 RLS
alter table categories enable row level security;
alter table prompts enable row level security;
alter table favorites enable row level security;

-- ============================================================
-- categories: 所有人可读
-- ============================================================
create policy "categories_public_read"
  on categories for select
  using (true);

-- ============================================================
-- prompts 策略
-- ============================================================

-- 所有人可读 public 提示词
create policy "prompts_public_read"
  on prompts for select
  using (is_public = true);

-- 登录用户可读自己的所有提示词（包括私有）
create policy "prompts_owner_read"
  on prompts for select
  using (auth.uid() = user_id);

-- 登录用户可创建提示词
create policy "prompts_insert"
  on prompts for insert
  with check (auth.uid() = user_id);

-- 用户只能更新自己的提示词
create policy "prompts_update"
  on prompts for update
  using (auth.uid() = user_id);

-- 用户只能删除自己的提示词
create policy "prompts_delete"
  on prompts for delete
  using (auth.uid() = user_id);

-- ============================================================
-- favorites 策略
-- ============================================================

-- 用户只能读自己的收藏
create policy "favorites_read"
  on favorites for select
  using (auth.uid() = user_id);

-- 用户只能创建自己的收藏
create policy "favorites_insert"
  on favorites for insert
  with check (auth.uid() = user_id);

-- 用户只能删除自己的收藏
create policy "favorites_delete"
  on favorites for delete
  using (auth.uid() = user_id);
