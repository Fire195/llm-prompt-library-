'use client'

import { useState } from 'react'

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="px-3 py-1 text-xs rounded border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--accent)] transition-colors"
    >
      {copied ? '已复制' : '复制'}
    </button>
  )
}
