import { FeedbackData } from "@/types/response";

const submitFeedback = async (feedbackData: FeedbackData) => {
  try {
    const response = await fetch('/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedbackData)
    });

    if (!response.ok) {
      throw new Error('Failed to submit feedback');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error submitting feedback:", error);
    throw error;
  }
};

export const FeedbackService = {
  submitFeedback,
};
