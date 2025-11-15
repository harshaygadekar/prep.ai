"use client";

import React, { useContext } from "react";

interface Response {
  createResponse: (payload: any) => Promise<any>;
  saveResponse: (payload: any, call_id: string) => Promise<void>;
}

export const ResponseContext = React.createContext<Response>({
  createResponse: async () => ({}),
  saveResponse: async () => {},
});

interface ResponseProviderProps {
  children: React.ReactNode;
}

export function ResponseProvider({ children }: ResponseProviderProps) {
  const createResponse = async (payload: any) => {
    try {
      const response = await fetch('/api/interview-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'start_session',
          interviewId: payload.interview_id,
          sessionData: {
            candidateName: payload.name,
            candidateEmail: payload.email,
            callId: payload.call_id
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create session');
      }

      const data = await response.json();

      // Return in format expected by existing code
      return {
        id: data.session?.id,
        call_id: payload.call_id,
        interview_id: payload.interview_id,
        sessionId: data.session?.id,
        details: payload.details || {},
        is_analysed: false,
        created_at: data.session?.startTime || new Date().toISOString()
      };
    } catch (error) {
      console.error('Error creating session:', error);
      // Return fallback for graceful degradation
      return {
        id: Date.now().toString(),
        call_id: payload.call_id || Date.now().toString(),
        interview_id: payload.interview_id,
        details: payload.details || {},
        is_analysed: false,
        created_at: new Date().toISOString()
      };
    }
  };

  const saveResponse = async (payload: any, call_id: string) => {
    try {
      const response = await fetch('/api/interview-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'submit_response',
          responseData: {
            sessionId: payload.sessionId,
            question: payload.question,
            answer: payload.answer
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save response');
      }

      const data = await response.json();
      console.log('Response saved successfully:', data);
    } catch (error) {
      console.error('Error saving response for call', call_id, error);
    }
  };

  return (
    <ResponseContext.Provider
      value={{
        createResponse,
        saveResponse,
      }}
    >
      {children}
    </ResponseContext.Provider>
  );
}

export const useResponses = () => {
  const value = useContext(ResponseContext);

  return value;
};
