"use client";

import React, { useState, useContext, ReactNode, useEffect } from "react";
import { Interview } from "@/types/interview";
import { useClerk, useOrganization } from "@clerk/nextjs";

interface InterviewContextProps {
  interviews: Interview[];
  setInterviews: React.Dispatch<React.SetStateAction<Interview[]>>;
  getInterviewById: (interviewId: string) => Promise<Interview | null>;
  interviewsLoading: boolean;
  setInterviewsLoading: (interviewsLoading: boolean) => void;
  fetchInterviews: () => void;
  error: string | null;
}

export const InterviewContext = React.createContext<InterviewContextProps>({
  interviews: [],
  setInterviews: () => {},
  getInterviewById: async () => null,
  setInterviewsLoading: () => undefined,
  interviewsLoading: false,
  fetchInterviews: () => {},
  error: null,
});

interface InterviewProviderProps {
  children: ReactNode;
}

export function InterviewProvider({ children }: InterviewProviderProps) {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const { user } = useClerk();
  const { organization } = useOrganization();
  const [interviewsLoading, setInterviewsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInterviews = async () => {
    try {
      setInterviewsLoading(true);
      setError(null);
      const response = await fetch('/api/interviews');

      if (!response.ok) {
        throw new Error('Failed to fetch interviews');
      }

      const data = await response.json();

      if (data.interviews) {
        setInterviews(data.interviews);
      }
    } catch (error) {
      console.error('Error fetching interviews:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch interviews');
    } finally {
      setInterviewsLoading(false);
    }
  };

  const getInterviewById = async (interviewId: string) => {
    try {
      const response = await fetch(`/api/interviews/${interviewId}`);
      const data = await response.json();
      
      if (data.interview) {
        return data.interview;
      }
      return null;
    } catch (error) {
      console.error('Error fetching interview:', error);
      return null;
    }
  };

  useEffect(() => {
    if (organization?.id || user?.id) {
      fetchInterviews();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organization?.id, user?.id]);

  return (
    <InterviewContext.Provider
      value={{
        interviews,
        setInterviews,
        getInterviewById,
        interviewsLoading,
        setInterviewsLoading,
        fetchInterviews,
        error,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
}

export const useInterviews = () => {
  const value = useContext(InterviewContext);

  return value;
};
