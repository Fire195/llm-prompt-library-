'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <nav className="border-b border-[var(--border)] bg-[var(--background)]">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg text-[var(--primary)]">
          Prompt Library
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
            浏览
          </Link>
          {user ? (
            <>
              <Link href="/prompts/new" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                创建
              </Link>
              <Link href="/my/prompts" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                我的
              </Link>
              <button
                onClick={handleSignOut}
                className="px-3 py-1.5 rounded-md border border-[var(--border)] hover:bg-[var(--accent)] text-[var(--foreground)]"
              >
                退出
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                登录
              </Link>
              <Link
                href="/register"
                className="px-3 py-1.5 rounded-md bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90"
              >
                注册
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
