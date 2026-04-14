import { createServerSupabaseClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { CopyButton } from '@/components/copy-button'

export default async function PromptDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()

  const { data: prompt } = await supabase
    .from('prompts')
    .select('*')
    .eq('id', id)
    .single()

  if (!prompt) notFound()

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-4 flex items-center gap-2">
        {prompt.category_slug && (
          <span className="px-2 py-0.5 rounded-full text-xs bg-[var(--secondary)] text-[var(--secondary-foreground)]">
            {prompt.category_slug}
          </span>
        )}
      </div>
      <h1 className="text-2xl font-bold mb-2">{prompt.title}</h1>
      {prompt.description && (
        <p className="text-[var(--muted-foreground)] mb-6">{prompt.description}</p>
      )}

      <div className="relative rounded-lg border border-[var(--border)] bg-[var(--muted)] p-4">
        <div className="absolute top-3 right-3">
          <CopyButton text={prompt.content} />
        </div>
        <pre className="whitespace-pre-wrap text-sm font-mono pr-12">{prompt.content}</pre>
      </div>

      <p className="mt-4 text-xs text-[var(--muted-foreground)]">
        创建于 {new Date(prompt.created_at).toLocaleDateString('zh-CN')}
      </p>
    </div>
  )
}
