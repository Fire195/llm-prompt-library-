import { createServerSupabaseClient } from '@/lib/supabase-server'
import { PromptCard } from '@/components/prompt-card'
import Link from 'next/link'

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const params = await searchParams
  const supabase = await createServerSupabaseClient()

  const { data: categories } = await supabase.from('categories').select('*').order('name')

  let query = supabase
    .from('prompts')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false })

  if (params.category) {
    query = query.eq('category_slug', params.category)
  }

  const { data: prompts } = await query

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">发现优质提示词</h1>
        <p className="text-[var(--muted-foreground)]">浏览、收藏和使用社区分享的 LLM 提示词</p>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        <Link
          href="/"
          className={`px-4 py-2 rounded-full text-sm ${
            !params.category
              ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
              : 'bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:bg-[var(--accent)]'
          }`}
        >
          全部
        </Link>
        {categories?.map((cat) => (
          <Link
            key={cat.id}
            href={`/?category=${cat.slug}`}
            className={`px-4 py-2 rounded-full text-sm ${
              params.category === cat.slug
                ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                : 'bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:bg-[var(--accent)]'
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {prompts && prompts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {prompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-[var(--muted-foreground)]">暂无提示词</div>
      )}
    </div>
  )
}
