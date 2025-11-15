import { DatabaseService } from '@/lib/db.service'

export class ResponseService {
  /**
   * Get all responses for a specific interview
   */
  static async getAllResponses(interviewId: string) {
    try {
      const sessions = await DatabaseService.getSessionsByInterviewId(interviewId)

      // Return sessions with their responses
      return sessions.map(session => ({
        id: session.id,
        callId: session.callId,
        candidateName: session.candidateName || 'Anonymous',
        candidateEmail: session.candidateEmail || '',
        status: session.status,
        overallScore: session.overallScore,
        communicationScore: session.communicationScore,
        technicalScore: session.technicalScore,
        problemSolvingScore: session.problemSolvingScore,
        confidenceScore: session.confidenceScore,
        startTime: session.startTime,
        endTime: session.endTime,
        duration: session.duration,
        tabSwitchCount: session.tabSwitchCount,
        transcript: session.transcript,
        responses: session.responses,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt
      }))
    } catch (error) {
      console.error('Error fetching responses:', error)
      throw new Error('Failed to fetch interview responses')
    }
  }

  /**
   * Get a specific response by session ID
   */
  static async getResponseBySessionId(sessionId: string) {
    try {
      const session = await DatabaseService.getSessionById(sessionId)

      if (!session) {
        throw new Error('Session not found')
      }

      return {
        id: session.id,
        callId: session.callId,
        candidateName: session.candidateName || 'Anonymous',
        candidateEmail: session.candidateEmail || '',
        status: session.status,
        overallScore: session.overallScore,
        communicationScore: session.communicationScore,
        technicalScore: session.technicalScore,
        problemSolvingScore: session.problemSolvingScore,
        confidenceScore: session.confidenceScore,
        startTime: session.startTime,
        endTime: session.endTime,
        duration: session.duration,
        tabSwitchCount: session.tabSwitchCount,
        transcript: session.transcript,
        responses: session.responses,
        interview: session.interview,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt
      }
    } catch (error) {
      console.error('Error fetching response:', error)
      throw error
    }
  }

  /**
   * Get response by call ID
   */
  static async getResponseByCallId(callId: string) {
    try {
      const session = await DatabaseService.getSessionByCallId(callId)

      if (!session) {
        throw new Error('Session not found')
      }

      return {
        id: session.id,
        callId: session.callId,
        candidateName: session.candidateName || 'Anonymous',
        candidateEmail: session.candidateEmail || '',
        status: session.status,
        overallScore: session.overallScore,
        communicationScore: session.communicationScore,
        technicalScore: session.technicalScore,
        problemSolvingScore: session.problemSolvingScore,
        confidenceScore: session.confidenceScore,
        startTime: session.startTime,
        endTime: session.endTime,
        duration: session.duration,
        tabSwitchCount: session.tabSwitchCount,
        transcript: session.transcript,
        responses: session.responses,
        interview: session.interview,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt
      }
    } catch (error) {
      console.error('Error fetching response by call ID:', error)
      throw error
    }
  }

  /**
   * Update candidate status for a response
   */
  static async updateCandidateStatus(sessionId: string, status: string) {
    try {
      // You can add a status field to the Session model if needed
      // For now, we'll use metadata to store this
      const session = await DatabaseService.getSessionById(sessionId)

      if (!session) {
        throw new Error('Session not found')
      }

      const metadata = (session.metadata as any) || {}
      metadata.candidateStatus = status

      return await DatabaseService.updateSession(sessionId, { metadata })
    } catch (error) {
      console.error('Error updating candidate status:', error)
      throw error
    }
  }

  /**
   * Delete a response
   */
  static async deleteResponse(sessionId: string) {
    try {
      // Note: This will cascade delete all responses due to onDelete: Cascade in schema
      const session = await DatabaseService.getSessionById(sessionId)

      if (!session) {
        throw new Error('Session not found')
      }

      // Update the session status instead of deleting
      return await DatabaseService.updateSession(sessionId, {
        status: 'CANCELLED'
      })
    } catch (error) {
      console.error('Error deleting response:', error)
      throw error
    }
  }
}

export default ResponseService
