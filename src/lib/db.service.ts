import prisma from './prisma'
import { Prisma } from '@prisma/client'

export class DatabaseService {
  // Interviewers
  static async getAllInterviewers(userId: string, orgId?: string) {
    return prisma.interviewer.findMany({
      where: {
        OR: [
          { userId },
          { orgId: orgId || undefined }
        ]
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }

  static async getInterviewerById(id: string) {
    return prisma.interviewer.findUnique({
      where: { id },
      include: {
        interviews: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        }
      }
    })
  }

  static async createInterviewer(data: {
    userId: string
    orgId?: string
    name: string
    description: string
    personality: string
    expertise: string[]
    avatarUrl?: string
    agentId?: string
    rapport?: number
    exploration?: number
    empathy?: number
    speed?: number
  }) {
    return prisma.interviewer.create({
      data
    })
  }

  static async updateInterviewer(id: string, data: Partial<Prisma.InterviewerUpdateInput>) {
    return prisma.interviewer.update({
      where: { id },
      data
    })
  }

  static async deleteInterviewer(id: string) {
    return prisma.interviewer.delete({
      where: { id }
    })
  }

  // Interviews
  static async getAllInterviews(userId: string, orgId?: string) {
    return prisma.interview.findMany({
      where: {
        OR: [
          { userId },
          { orgId: orgId || undefined }
        ]
      },
      include: {
        interviewer: true,
        sessions: {
          where: { status: 'COMPLETED' },
          select: {
            id: true,
            overallScore: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }

  static async getInterviewById(id: string) {
    return prisma.interview.findUnique({
      where: { id },
      include: {
        interviewer: true,
        sessions: {
          include: {
            responses: true
          }
        }
      }
    })
  }

  static async getInterviewBySlug(slug: string) {
    return prisma.interview.findUnique({
      where: { urlSlug: slug },
      include: {
        interviewer: true
      }
    })
  }

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
    urlSlug: string
    interviewerId?: string
  }) {
    return prisma.interview.create({
      data,
      include: {
        interviewer: true
      }
    })
  }

  static async updateInterview(id: string, data: Partial<Prisma.InterviewUpdateInput>) {
    return prisma.interview.update({
      where: { id },
      data
    })
  }

  static async deleteInterview(id: string) {
    return prisma.interview.delete({
      where: { id }
    })
  }

  static async incrementResponseCount(interviewId: string) {
    return prisma.interview.update({
      where: { id: interviewId },
      data: {
        responseCount: {
          increment: 1
        }
      }
    })
  }

  static async addRespondent(interviewId: string, email: string) {
    const interview = await prisma.interview.findUnique({
      where: { id: interviewId },
      select: { respondents: true }
    })

    if (!interview) return null

    return prisma.interview.update({
      where: { id: interviewId },
      data: {
        respondents: {
          set: [...interview.respondents, email]
        }
      }
    })
  }

  // Sessions
  static async createSession(data: {
    interviewId: string
    userId: string
    candidateName?: string
    candidateEmail?: string
    callId?: string
  }) {
    return prisma.session.create({
      data: {
        ...data,
        status: 'ACTIVE'
      }
    })
  }

  static async getSessionById(id: string) {
    return prisma.session.findUnique({
      where: { id },
      include: {
        interview: {
          include: {
            interviewer: true
          }
        },
        responses: {
          orderBy: { timestamp: 'asc' }
        }
      }
    })
  }

  static async getSessionByCallId(callId: string) {
    return prisma.session.findUnique({
      where: { callId },
      include: {
        interview: true,
        responses: true
      }
    })
  }

  static async updateSession(id: string, data: Partial<Prisma.SessionUpdateInput>) {
    return prisma.session.update({
      where: { id },
      data
    })
  }

  static async getSessionsByUserId(userId: string) {
    return prisma.session.findMany({
      where: { userId },
      include: {
        interview: {
          include: {
            interviewer: true
          }
        },
        responses: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }

  static async getSessionsByInterviewId(interviewId: string) {
    return prisma.session.findMany({
      where: { interviewId },
      include: {
        responses: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }

  // Responses
  static async createResponse(data: {
    sessionId: string
    question: string
    answer: string
    score: number
    feedback: string
    strengths: string[]
    improvements: string[]
    analysisData?: any
  }) {
    return prisma.response.create({
      data
    })
  }

  static async getResponsesBySessionId(sessionId: string) {
    return prisma.response.findMany({
      where: { sessionId },
      orderBy: { timestamp: 'asc' }
    })
  }

  // Resumes
  static async createResume(data: {
    userId: string
    fileName: string
    fileType: string
    fileSize: number
    content: string
    extractedSkills: string[]
    generatedQuestions: string[]
    parsedData?: any
  }) {
    return prisma.resume.create({
      data
    })
  }

  static async getResumesByUserId(userId: string) {
    return prisma.resume.findMany({
      where: { userId },
      orderBy: { uploadedAt: 'desc' }
    })
  }

  static async getResumeById(id: string) {
    return prisma.resume.findUnique({
      where: { id }
    })
  }

  // Analytics
  static async getAnalytics(userId: string, orgId?: string) {
    const [sessions, interviews, completedSessions] = await Promise.all([
      prisma.session.findMany({
        where: {
          OR: [
            { userId },
            { interview: { orgId: orgId || undefined } }
          ]
        }
      }),
      prisma.interview.count({
        where: {
          OR: [
            { userId },
            { orgId: orgId || undefined }
          ]
        }
      }),
      prisma.session.findMany({
        where: {
          OR: [
            { userId },
            { interview: { orgId: orgId || undefined } }
          ],
          status: 'COMPLETED'
        },
        select: {
          overallScore: true,
          communicationScore: true,
          technicalScore: true,
          problemSolvingScore: true,
          confidenceScore: true,
          duration: true,
          createdAt: true
        }
      })
    ])

    const totalSessions = sessions.length
    const completedCount = completedSessions.length

    // Calculate averages
    const avgOverall = completedSessions.reduce((acc, s) => acc + (s.overallScore || 0), 0) / (completedCount || 1)
    const avgComm = completedSessions.reduce((acc, s) => acc + (s.communicationScore || 0), 0) / (completedCount || 1)
    const avgTech = completedSessions.reduce((acc, s) => acc + (s.technicalScore || 0), 0) / (completedCount || 1)
    const avgProblem = completedSessions.reduce((acc, s) => acc + (s.problemSolvingScore || 0), 0) / (completedCount || 1)
    const avgConf = completedSessions.reduce((acc, s) => acc + (s.confidenceScore || 0), 0) / (completedCount || 1)
    const avgDuration = completedSessions.reduce((acc, s) => acc + (s.duration || 0), 0) / (completedCount || 1)

    // Get recent sessions
    const recentSessions = await prisma.session.findMany({
      where: {
        OR: [
          { userId },
          { interview: { orgId: orgId || undefined } }
        ]
      },
      include: {
        interview: {
          select: {
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    return {
      totalInterviews: interviews,
      totalSessions,
      completedSessions: completedCount,
      averageScore: Math.round(avgOverall * 10) / 10,
      completionRate: totalSessions > 0 ? (completedCount / totalSessions) * 100 : 0,
      skillBreakdown: {
        communication: Math.round(avgComm * 10) / 10,
        technical: Math.round(avgTech * 10) / 10,
        problemSolving: Math.round(avgProblem * 10) / 10,
        confidence: Math.round(avgConf * 10) / 10
      },
      averageDuration: Math.round(avgDuration),
      recentSessions: recentSessions.map(s => ({
        id: s.id,
        interviewName: s.interview.name,
        status: s.status,
        score: s.overallScore,
        date: s.createdAt
      })),
      performanceTrend: completedSessions
        .slice(-7)
        .map(s => ({
          date: s.createdAt,
          score: s.overallScore || 0
        }))
    }
  }

  // Utility methods
  static async checkRespondentExists(interviewId: string, email: string) {
    const interview = await prisma.interview.findUnique({
      where: { id: interviewId },
      select: { respondents: true }
    })

    return interview?.respondents.includes(email) || false
  }

  static async getResponseCountByOrgId(orgId: string) {
    const result = await prisma.session.aggregate({
      where: {
        interview: {
          orgId
        }
      },
      _count: {
        id: true
      }
    })

    return result._count.id
  }

  static async deactivateInterviewsByOrgId(orgId: string) {
    return prisma.interview.updateMany({
      where: { orgId },
      data: { isActive: false }
    })
  }
}

export default DatabaseService
