# LLM Prompt Library

一个基于 Monorepo 架构的 LLM 提示词库全栈应用。

## 技术栈

| 层级 | 技术 |
|------|------|
| Monorepo | pnpm workspace + Turborepo |
| 主应用 | Next.js 16 (App Router) + React |
| 管理后台 | Vite + React |
| UI | shadcn/ui + Tailwind CSS |
| 后端 | Supabase (PostgreSQL + Auth + RLS) |
| CI/CD | GitHub Actions + Vercel |

## 项目结构

```
llm-prompt-library/
├── apps/
│   ├── web/          # Next.js 主应用（用户端）
│   └── admin/        # Vite 管理后台
├── packages/
│   ├── ui/           # 共享 UI 组件
│   ├── types/        # 共享 TypeScript 类型
│   └── config/       # 共享 ESLint/TS 配置
├── supabase/
│   ├── schema.sql    # 数据库表结构
│   ├── rls.sql       # Row Level Security 策略
│   └── seed.sql      # 示例数据
└── .github/
    └── workflows/
        └── ci.yml    # CI/CD 流程
```

## 本地运行

### 前置条件

- Node.js >= 18
- pnpm >= 9

### 1. 克隆仓库

```bash
git clone https://github.com/Fire195/llm-prompt-library-.git
cd llm-prompt-library-
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 配置 Supabase

1. 在 [supabase.com](https://supabase.com) 创建新项目
2. 在 SQL Editor 中依次执行：
   - `supabase/schema.sql`（创建表）
   - `supabase/rls.sql`（配置权限）
   - `supabase/seed.sql`（插入示例数据）

### 4. 配置环境变量

```bash
# apps/web
cp apps/web/.env.local.example apps/web/.env.local
# 填入你的 Supabase URL 和 anon key

# apps/admin
cp apps/admin/.env.local.example apps/admin/.env.local
# 填入你的 Supabase URL 和 anon key
```

### 5. 启动开发服务器

```bash
pnpm dev
# web:   http://localhost:3000
# admin: http://localhost:5173
```

## 构建

```bash
pnpm build
```

## 部署

### Vercel（推荐）

1. 在 [vercel.com](https://vercel.com) 导入 GitHub 仓库
2. 创建两个项目：
   - `apps/web` → Root Directory: `apps/web`
   - `apps/admin` → Root Directory: `apps/admin`
3. 在每个项目的 Environment Variables 中添加：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`（web）
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`（admin）

### GitHub Actions

在仓库 Settings > Secrets 中添加：
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

每次 push 到 main 分支会自动触发 CI（lint + build）。

## 功能

- 浏览公开提示词，支持分类筛选
- 注册/登录（Supabase Auth）
- 创建、管理个人提示词
- 收藏提示词
- 一键复制提示词内容
- 管理后台：提示词增删改查
