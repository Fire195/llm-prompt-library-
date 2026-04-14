import { useState, useEffect } from 'react'
import { createClient } from './lib/supabase'
import { LoginPage } from './pages/LoginPage'
import { PromptsPage } from './pages/PromptsPage'
import type { User } from '@supabase/supabase-js'
import './index.css'

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">加载中...</p>
      </div>
    )
  }

  if (!user) return <LoginPage />

  return <PromptsPage user={user} />
}

export default App
