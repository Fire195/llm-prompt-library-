import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { PromptCard } from '@/components/prompt-card'
import Link from 'next/link'

export default async function MyPromptsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: prompts } = await supabase
    .from('prompts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">我的提示词</h1>
        <Link
          href="/prompts/new"
          className="px-4 py-2 rounded-md bg-[var(--primary)] text-[var(--primary-foreground)] text-sm hover:opacity-90"
        >
          + 创建
        </Link>
      </div>
      <div className="flex gap-4 mb-6 text-sm">
        <Link href="/my/prompts" className="font-medium text-[var(--primary)]">我的提示词</Link>
        <Link href="/my/favorites" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">我的收藏</Link>
      </div>
      {prompts && prompts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {prompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-[var(--muted-foreground)]">
          还没有创建提示词，
          <Link href="/prompts/new" className="text-[var(--primary)] hover:underline">立即创建</Link>
        </div>
      )}
    </div>
  )
}
