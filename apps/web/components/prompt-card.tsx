'use client'

import Link from 'next/link'
import type { Prompt } from '@repo/types'

export function PromptCard({ prompt }: { prompt: Prompt }) {
  return (
    <Link href={`/prompts/${prompt.id}`}>
      <div className="h-full rounded-lg border border-[var(--border)] bg-[var(--card)] p-5 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-[var(--card-foreground)] line-clamp-1">{prompt.title}</h3>
          {prompt.category_slug && (
            <span className="shrink-0 px-2 py-0.5 rounded-full text-xs bg-[var(--secondary)] text-[var(--secondary-foreground)]">
              {prompt.category_slug}
            </span>
          )}
        </div>
        {prompt.description && (
          <p className="text-sm text-[var(--muted-foreground)] line-clamp-2 mb-3">
            {prompt.description}
          </p>
        )}
        <p className="text-xs text-[var(--muted-foreground)] line-clamp-3 font-mono bg-[var(--muted)] rounded p-2">
          {prompt.content}
        </p>
      </div>
    </Link>
  )
}
