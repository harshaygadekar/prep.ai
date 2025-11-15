import { DatabaseService } from '@/lib/db.service'
import { nanoid } from 'nanoid'

export class InterviewService {
  /**
   * Get all interviews for a user
   */
  static async getAllInterviews(userId: string, orgId?: string) {
    try {
      return await DatabaseService.getAllInterviews(userId, orgId)
    } catch (error) {
      console.error('Error fetching interviews:', error)
      throw new Error('Failed to fetch interviews')
    }
  }

  /**
   * Get a specific interview by ID
   */
  static async getInterviewById(id: string) {
    try {
      const interview = await DatabaseService.getInterviewById(id)

      if (!interview) {
        throw new Error('Interview not found')
      }

      return interview
    } catch (error) {
      console.error('Error fetching interview:', error)
      throw error
    }
  }

  /**
   * Get interview by URL slug
   */
  static async getInterviewBySlug(slug: string) {
    try {
      const interview = await DatabaseService.getInterviewBySlug(slug)

      if (!interview) {
        throw new Error('Interview not found')
      }

      return interview
    } catch (error) {
      console.error('Error fetching interview by slug:', error)
      throw error
    }
  }

  /**
   * Create a new interview
   */
  static async createInterview(data: {
    userId: string
    orgId?: string
    name: string
    description?: string
    objective?: string
    questions: any
    questionCount?: number
    timeDuration?: string
    isAnonymous?: boolean
    themeColor?: string
    logoUrl?: string
    interviewerId?: string
  }) {
    try {
      // Generate unique URL slug
      const randomString = nanoid(10)
      const sanitizedName = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 40)

      const urlSlug = `${randomString}-${sanitizedName}`

      const interview = await DatabaseService.createInterview({
        ...data,
        urlSlug,
        questionCount: data.questionCount || 5,
        timeDuration: data.timeDuration || '30',
        isAnonymous: data.isAnonymous ?? false
      })

      return interview
    } catch (error) {
      console.error('Error creating interview:', error)
      throw new Error('Failed to create interview')
    }
  }

  /**
   * Update an interview
   */
  static async updateInterview(id: string, data: {
    name?: string
    description?: string
    objective?: string
    questions?: any
    questionCount?: number
    timeDuration?: string
    isAnonymous?: boolean
    isActive?: boolean
    themeColor?: string
    logoUrl?: string
    interviewerId?: string
  }) {
    try {
      const interview = await DatabaseService.updateInterview(id, data)
      return interview
    } catch (error) {
      console.error('Error updating interview:', error)
      throw new Error('Failed to update interview')
    }
  }

  /**
   * Delete an interview
   */
  static async deleteInterview(id: string) {
    try {
      return await DatabaseService.deleteInterview(id)
    } catch (error) {
      console.error('Error deleting interview:', error)
      throw new Error('Failed to delete interview')
    }
  }

  /**
   * Increment response count for an interview
   */
  static async incrementResponseCount(interviewId: string) {
    try {
      return await DatabaseService.incrementResponseCount(interviewId)
    } catch (error) {
      console.error('Error incrementing response count:', error)
      throw error
    }
  }

  /**
   * Add respondent to interview
   */
  static async addRespondent(interviewId: string, email: string) {
    try {
      return await DatabaseService.addRespondent(interviewId, email)
    } catch (error) {
      console.error('Error adding respondent:', error)
      throw error
    }
  }

  /**
   * Check if respondent exists
   */
  static async checkRespondentExists(interviewId: string, email: string) {
    try {
      return await DatabaseService.checkRespondentExists(interviewId, email)
    } catch (error) {
      console.error('Error checking respondent:', error)
      return false
    }
  }
}

export default InterviewService
