import { useState, useEffect } from 'react'
import { createClient } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'
import type { Prompt } from '@repo/types'

const CATEGORIES = [
  { slug: 'writing', name: '写作' },
  { slug: 'coding', name: '编程' },
  { slug: 'translation', name: '翻译' },
  { slug: 'analysis', name: '分析' },
  { slug: 'creative', name: '创意' },
]

export function PromptsPage({ user }: { user: User }) {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null)
  const [form, setForm] = useState({ title: '', content: '', description: '', category_slug: '', is_public: true })
  const supabase = createClient()

  const fetchPrompts = async () => {
    const { data } = await supabase.from('prompts').select('*').order('created_at', { ascending: false })
    setPrompts(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchPrompts() }, [])

  const handleSignOut = () => supabase.auth.signOut()

  const openCreate = () => {
    setEditingPrompt(null)
    setForm({ title: '', content: '', description: '', category_slug: '', is_public: true })
    setShowForm(true)
  }

  const openEdit = (p: Prompt) => {
    setEditingPrompt(p)
    setForm({ title: p.title, content: p.content, description: p.description ?? '', category_slug: p.category_slug ?? '', is_public: p.is_public })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确认删除？')) return
    await supabase.from('prompts').delete().eq('id', id)
    fetchPrompts()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingPrompt) {
      await supabase.from('prompts').update({ ...form, description: form.description || null, category_slug: form.category_slug || null }).eq('id', editingPrompt.id)
    } else {
      await supabase.from('prompts').insert({ ...form, description: form.description || null, category_slug: form.category_slug || null, user_id: user.id })
    }
    setShowForm(false)
    fetchPrompts()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 h-14 flex items-center justify-between">
        <h1 className="font-bold text-lg">Prompt Library 管理后台</h1>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-500">{user.email}</span>
          <button onClick={handleSignOut} className="px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-100">退出</button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">提示词管理</h2>
          <button onClick={openCreate} className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700">+ 新增</button>
        </div>

        {loading ? (
          <p className="text-gray-500">加载中...</p>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">标题</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">分类</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">状态</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">创建时间</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {prompts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{p.title}</td>
                    <td className="px-4 py-3 text-gray-500">{CATEGORIES.find(c => c.slug === p.category_slug)?.name ?? '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${p.is_public ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {p.is_public ? '公开' : '私有'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{new Date(p.created_at).toLocaleDateString('zh-CN')}</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button onClick={() => openEdit(p)} className="text-blue-600 hover:underline">编辑</button>
                      <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:underline">删除</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {prompts.length === 0 && (
              <p className="text-center py-8 text-gray-400">暂无数据</p>
            )}
          </div>
        )}
      </main>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg p-6 mx-4">
            <h3 className="font-semibold text-lg mb-4">{editingPrompt ? '编辑提示词' : '新增提示词'}</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">标题 *</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required className="w-full h-9 px-3 rounded border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">简介</label>
                <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full h-9 px-3 rounded border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">分类</label>
                <select value={form.category_slug} onChange={e => setForm(f => ({ ...f, category_slug: e.target.value }))} className="w-full h-9 px-3 rounded border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">不选择</option>
                  {CATEGORIES.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">内容 *</label>
                <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} required rows={5} className="w-full px-3 py-2 rounded border border-gray-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="pub" checked={form.is_public} onChange={e => setForm(f => ({ ...f, is_public: e.target.checked }))} />
                <label htmlFor="pub" className="text-sm">公开</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 h-9 rounded bg-blue-600 text-white text-sm hover:bg-blue-700">保存</button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 h-9 rounded border border-gray-300 text-sm hover:bg-gray-50">取消</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
