export interface Question {
  id: string;
  question: string;
  followUpCount: number;
}

export interface Quote {
  quote: string;
  callId: string;
}

export interface InterviewBase {
  userId: string;
  orgId?: string | null;
  name: string;
  interviewerId?: string | null;
  objective?: string | null;
  questionCount: number;
  timeDuration: string;
  isAnonymous: boolean;
  questions: Question[];
  description?: string | null;
  responseCount: number;
}

export interface InterviewDetails {
  id: string;
  createdAt: Date;
  updatedAt?: Date;
  urlSlug: string;
  insights?: string[];
  quotes?: Quote[];
  details?: any;
  isActive: boolean;
  isViewed?: boolean;
  themeColor?: string | null;
  logoUrl?: string | null;
  respondents: string[];
}

export interface Interview extends InterviewBase, InterviewDetails {}
