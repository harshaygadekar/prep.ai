// Mock data store to replace database functionality
export interface MockInterviewer {
  id: string;
  name: string;
  description: string;
  personality: string;
  expertise: string[];
  avatar_url?: string;
  created_at: string;
  agent_id?: string;
}

export interface MockInterview {
  id: string;
  name: string;
  description: string;
  questions: string[];
  is_active: boolean;
  response_count: number;
  created_at: string;
  interviewer_id?: string;
}

export interface MockSession {
  id: string;
  interview_id: string;
  user_id: string;
  status: 'active' | 'completed' | 'paused';
  start_time: string;
  end_time?: string;
  duration?: string;
  overall_score?: number;
  responses: MockResponse[];
}

export interface MockResponse {
  id: string;
  session_id: string;
  question: string;
  answer: string;
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  timestamp: string;
}

export interface MockResume {
  id: string;
  user_id: string;
  file_name: string;
  file_type: string;
  content: string;
  extracted_skills: string[];
  generated_questions: string[];
  uploaded_at: string;
}

// In-memory storage
let mockInterviewers: MockInterviewer[] = [
  {
    id: "1",
    name: "Lisa",
    description: "Friendly and encouraging interviewer perfect for beginners",
    personality: "Supportive and patient, helps candidates feel comfortable",
    expertise: ["Behavioral Questions", "Communication Skills", "General Interview Prep"],
    avatar_url: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    created_at: new Date().toISOString(),
    agent_id: "agent_lisa_001"
  },
  {
    id: "2", 
    name: "Bob",
    description: "Professional technical interviewer for advanced candidates",
    personality: "Direct and thorough, focuses on technical competency",
    expertise: ["Technical Questions", "System Design", "Problem Solving", "Coding"],
    avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    created_at: new Date().toISOString(),
    agent_id: "agent_bob_001"
  }
];

let mockInterviews: MockInterview[] = [
  {
    id: "1",
    name: "Software Engineer Interview",
    description: "Comprehensive technical interview for software engineering roles",
    questions: [
      "Tell me about yourself and your background in software development.",
      "Describe a challenging technical project you've worked on recently.",
      "How do you approach debugging a complex issue in production?",
      "Explain your experience with system design and scalability.",
      "How do you stay updated with new technologies and best practices?"
    ],
    is_active: true,
    response_count: 12,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    interviewer_id: "2"
  },
  {
    id: "2",
    name: "Product Manager Interview", 
    description: "Strategic interview focusing on product management skills",
    questions: [
      "Tell me about your experience in product management.",
      "How do you prioritize features in a product roadmap?",
      "Describe a time when you had to make a difficult product decision.",
      "How do you work with engineering and design teams?",
      "What metrics do you use to measure product success?"
    ],
    is_active: true,
    response_count: 8,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    interviewer_id: "1"
  },
  {
    id: "3",
    name: "Data Scientist Interview",
    description: "Technical interview for data science and analytics roles",
    questions: [
      "Explain your background in data science and analytics.",
      "How do you approach a new data science project?",
      "Describe your experience with machine learning algorithms.",
      "How do you handle missing or dirty data?",
      "What tools and technologies do you prefer for data analysis?"
    ],
    is_active: true,
    response_count: 5,
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    interviewer_id: "2"
  }
];

let mockSessions: MockSession[] = [];
let mockResponses: MockResponse[] = [];
let mockResumes: MockResume[] = [];

// Mock Data Service
export class MockDataService {
  // Interviewers
  static getAllInterviewers(): MockInterviewer[] {
    return [...mockInterviewers];
  }

  static getInterviewerById(id: string): MockInterviewer | null {
    return mockInterviewers.find(i => i.id === id) || null;
  }

  static createInterviewer(data: Partial<MockInterviewer>): MockInterviewer {
    const newInterviewer: MockInterviewer = {
      id: Date.now().toString(),
      name: data.name || "New Interviewer",
      description: data.description || "AI-powered interviewer",
      personality: data.personality || "Professional and thorough",
      expertise: data.expertise || ["General Interview"],
      avatar_url: data.avatar_url,
      created_at: new Date().toISOString(),
      agent_id: data.agent_id || `agent_${Date.now()}`
    };
    mockInterviewers.push(newInterviewer);
    return newInterviewer;
  }

  // Interviews
  static getAllInterviews(): MockInterview[] {
    return [...mockInterviews];
  }

  static getInterviewById(id: string): MockInterview | null {
    return mockInterviews.find(i => i.id === id) || null;
  }

  static createInterview(data: Partial<MockInterview>): MockInterview {
    const newInterview: MockInterview = {
      id: Date.now().toString(),
      name: data.name || "New Interview",
      description: data.description || "Interview session",
      questions: data.questions || ["Tell me about yourself."],
      is_active: data.is_active !== undefined ? data.is_active : true,
      response_count: 0,
      created_at: new Date().toISOString(),
      interviewer_id: data.interviewer_id
    };
    mockInterviews.push(newInterview);
    return newInterview;
  }

  static updateInterview(id: string, data: Partial<MockInterview>): MockInterview | null {
    const index = mockInterviews.findIndex(i => i.id === id);
    if (index === -1) return null;
    
    mockInterviews[index] = { ...mockInterviews[index], ...data };
    return mockInterviews[index];
  }

  // Sessions
  static createSession(data: Partial<MockSession>): MockSession {
    const newSession: MockSession = {
      id: Date.now().toString(),
      interview_id: data.interview_id || "",
      user_id: data.user_id || "",
      status: data.status || 'active',
      start_time: new Date().toISOString(),
      responses: []
    };
    mockSessions.push(newSession);
    return newSession;
  }

  static getSessionById(id: string): MockSession | null {
    return mockSessions.find(s => s.id === id) || null;
  }

  static updateSession(id: string, data: Partial<MockSession>): MockSession | null {
    const index = mockSessions.findIndex(s => s.id === id);
    if (index === -1) return null;
    
    mockSessions[index] = { ...mockSessions[index], ...data };
    return mockSessions[index];
  }

  static getSessionsByUserId(userId: string): MockSession[] {
    return mockSessions.filter(s => s.user_id === userId);
  }

  // Responses
  static createResponse(data: Partial<MockResponse>): MockResponse {
    const newResponse: MockResponse = {
      id: Date.now().toString(),
      session_id: data.session_id || "",
      question: data.question || "",
      answer: data.answer || "",
      score: data.score || 0,
      feedback: data.feedback || "",
      strengths: data.strengths || [],
      improvements: data.improvements || [],
      timestamp: new Date().toISOString()
    };
    mockResponses.push(newResponse);
    
    // Add to session
    const session = mockSessions.find(s => s.id === data.session_id);
    if (session) {
      session.responses.push(newResponse);
    }
    
    return newResponse;
  }

  static getResponsesBySessionId(sessionId: string): MockResponse[] {
    return mockResponses.filter(r => r.session_id === sessionId);
  }

  // Analytics
  static getAnalytics(userId: string) {
    const userSessions = this.getSessionsByUserId(userId);
    const completedSessions = userSessions.filter(s => s.status === 'completed');
    
    const totalSessions = userSessions.length;
    const avgScore = completedSessions.length > 0 
      ? completedSessions.reduce((acc, s) => acc + (s.overall_score || 0), 0) / completedSessions.length
      : 0;
    
    return {
      totalInterviews: mockInterviews.length,
      totalSessions,
      completedSessions: completedSessions.length,
      averageScore: Math.round(avgScore * 10) / 10,
      completionRate: totalSessions > 0 ? (completedSessions.length / totalSessions) * 100 : 0,
      recentSessions: userSessions.slice(-5)
    };
  }

  // Utility methods
  static incrementResponseCount(interviewId: string) {
    const interview = mockInterviews.find(i => i.id === interviewId);
    if (interview) {
      interview.response_count += 1;
    }
  }

  static resetData() {
    mockSessions = [];
    mockResponses = [];
  }

  // Additional utility methods for compatibility
  static getAllResponses(interviewId: string) {
    return mockSessions
      .filter(s => s.interview_id === interviewId)
      .flatMap(s => s.responses);
  }

  static getResponseCountByOrganizationId(orgId: string) {
    // Mock response count for organization
    return mockSessions.length * 3; // Assume 3 responses per session on average
  }

  static deactivateInterviewsByOrgId(orgId: string) {
    // Mock deactivation - in real app this would deactivate interviews
    mockInterviews.forEach(interview => {
      interview.is_active = false;
    });
  }

  // Resume methods
  static createResume(data: Partial<MockResume>): MockResume {
    const newResume: MockResume = {
      id: Date.now().toString(),
      user_id: data.user_id || "anonymous",
      file_name: data.file_name || "resume.pdf",
      file_type: data.file_type || "application/pdf",
      content: data.content || "",
      extracted_skills: data.extracted_skills || [],
      generated_questions: data.generated_questions || [],
      uploaded_at: new Date().toISOString()
    };
    
    // Store in memory (in production, would save to database)
    return newResume;
  }

  static getResumesByUserId(userId: string): MockResume[] {
    // Mock implementation - in production would query database
    return [];
  }
}