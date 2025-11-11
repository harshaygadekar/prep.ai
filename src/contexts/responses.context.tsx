"use client";

import React, { useContext } from "react";
import { MockDataService } from "@/lib/mockData";

interface Response {
  createResponse: (payload: any) => void;
  saveResponse: (payload: any, call_id: string) => void;
}

export const ResponseContext = React.createContext<Response>({
  createResponse: () => {},
  saveResponse: () => {},
});

interface ResponseProviderProps {
  children: React.ReactNode;
}

export function ResponseProvider({ children }: ResponseProviderProps) {
  const createResponse = async (payload: any) => {
    // Mock response creation
    const mockResponse = {
      id: Date.now().toString(),
      call_id: payload.call_id || Date.now().toString(),
      interview_id: payload.interview_id,
      details: payload.details || {},
      is_analysed: false,
      created_at: new Date().toISOString()
    };

    return mockResponse;
  };

  const saveResponse = async (payload: any, call_id: string) => {
    // Mock response saving
    console.log('Mock: Saving response for call', call_id, payload);
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
