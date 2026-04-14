// T9: Supabase 数据库类型定义
// 这些类型通常由 Supabase CLI 自动生成，这里手动定义以便开发

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string
        }
      }
      prompts: {
        Row: {
          id: string
          title: string
          content: string
          description: string | null
          category_slug: string | null
          user_id: string | null
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          description?: string | null
          category_slug?: string | null
          user_id?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          description?: string | null
          category_slug?: string | null
          user_id?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          prompt_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          prompt_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          prompt_id?: string
          created_at?: string
        }
      }
    }
  }
}

// 便捷类型导出
export type Category = Database['public']['Tables']['categories']['Row']
export type Prompt = Database['public']['Tables']['prompts']['Row']
export type Favorite = Database['public']['Tables']['favorites']['Row']

export type PromptInsert = Database['public']['Tables']['prompts']['Insert']
export type PromptUpdate = Database['public']['Tables']['prompts']['Update']
