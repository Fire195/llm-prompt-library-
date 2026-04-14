import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { PromptCard } from '@/components/prompt-card'
import Link from 'next/link'

export default async function MyFavoritesPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: favorites } = await supabase
    .from('favorites')
    .select('prompt_id, prompts(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const prompts = favorites?.map((f) => f.prompts).filter(Boolean) ?? []

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">我的收藏</h1>
      <div className="flex gap-4 mb-6 text-sm">
        <Link href="/my/prompts" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">我的提示词</Link>
        <Link href="/my/favorites" className="font-medium text-[var(--primary)]">我的收藏</Link>
      </div>
      {prompts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {prompts.map((prompt) => (
            // @ts-expect-error supabase join type
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-[var(--muted-foreground)]">
          还没有收藏提示词，
          <Link href="/" className="text-[var(--primary)] hover:underline">去浏览</Link>
        </div>
      )}
    </div>
  )
}
