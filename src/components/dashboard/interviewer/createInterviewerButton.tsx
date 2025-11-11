"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useInterviewers } from "@/contexts/interviewers.context";
import axios from "axios";
import { Plus, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function CreateInterviewerButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { setInterviewers } = useInterviewers();

  const createInterviewers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/create-interviewer", {});
      console.log(response);
      
      // Refresh interviewers list
      const interviewersResponse = await axios.get("/api/interviewers");
      setInterviewers(interviewersResponse.data.interviewers || []);
      
      toast.success("New AI interviewer created successfully!");
    } catch (error) {
      console.error("Error creating interviewers:", error);
      toast.error("Failed to create interviewer. Please try again.");
    }
    setIsLoading(false);
  };

  return (
    <Button
      onClick={() => createInterviewers()}
      disabled={isLoading}
      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          Creating...
        </>
      ) : (
        <>
          <Sparkles className="h-5 w-5" />
          Create AI Interviewer
        </>
      )}
    </Button>
  );
}

export default CreateInterviewerButton;
