import axios from "axios";

const getAllInterviewers = async () => {
  try {
    const response = await axios.get("/api/interviewers");
    return response.data.interviewers || [];
  } catch (error) {
    console.error("Error fetching interviewers:", error);
    return [];
  }
};

const createInterviewer = async (payload: any) => {
  try {
    const response = await axios.post("/api/interviewers", payload);
    return response.data;
  } catch (error) {
    console.error("Error creating interviewer:", error);
    return null;
  }
};

export const InterviewerClientService = {
  getAllInterviewers,
  createInterviewer,
};