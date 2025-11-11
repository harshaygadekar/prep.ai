export interface Interviewer {
  id: string
  userId: string
  orgId?: string | null
  name: string
  description: string
  personality: string
  expertise: string[]
  avatarUrl?: string | null
  agentId?: string | null
  rapport: number
  exploration: number
  empathy: number
  speed: number
  image?: string
  audio?: string
  created_at: Date
  updated_at?: Date
}
