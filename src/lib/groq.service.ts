import Groq from "groq-sdk"

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || ""
})

// Get model from env or use default
const DEFAULT_MODEL = "mixtral-8x7b-32768"
const getModel = () => process.env.GROQ_MODEL || DEFAULT_MODEL

export class GroqService {
  /**
   * Generate interview questions based on role and context
   */
  static async generateInterviewQuestions(params: {
    role: string
    objective: string
    questionCount: number
    context?: string
    skills?: string[]
  }): Promise<string[]> {
    const { role, objective, questionCount, context, skills } = params

    const prompt = `You are an expert interview question generator. Generate ${questionCount} high-quality interview questions for the following:

Role: ${role}
Objective: ${objective}
${skills && skills.length > 0 ? `Key Skills: ${skills.join(", ")}` : ""}
${context ? `Additional Context: ${context}` : ""}

Requirements:
- Generate diverse questions covering technical, behavioral, and problem-solving aspects
- Make questions specific and relevant to the role
- Include a mix of difficulty levels
- Questions should be open-ended and encourage detailed responses
- If skills are provided, include questions that probe those specific skills

Return ONLY a JSON array of question strings, no other text.`

    try {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        model: getModel(),
        temperature: 0.7,
        max_tokens: 2048,
        response_format: { type: "json_object" }
      })

      const content = completion.choices[0]?.message?.content || "{}"
      const parsed = JSON.parse(content)

      // Handle different possible response formats
      if (Array.isArray(parsed)) {
        return parsed.slice(0, questionCount)
      }
      if (parsed.questions && Array.isArray(parsed.questions)) {
        return parsed.questions.slice(0, questionCount)
      }

      // Fallback to extracting questions from object values
      const questions = Object.values(parsed).filter(v => typeof v === "string")
      return questions.slice(0, questionCount)
    } catch (error) {
      console.error("Error generating questions with Groq:", error)
      // Return fallback questions
      return generateFallbackQuestions(role, questionCount)
    }
  }

  /**
   * Analyze interview response and provide scoring
   */
  static async analyzeResponse(params: {
    question: string
    answer: string
    context?: string
  }): Promise<{
    score: number
    communicationScore: number
    technicalScore: number
    problemSolvingScore: number
    confidenceScore: number
    feedback: string
    strengths: string[]
    improvements: string[]
  }> {
    const { question, answer, context } = params

    const prompt = `You are an expert interview evaluator. Analyze the following interview response:

Question: ${question}
Answer: ${answer}
${context ? `Context: ${context}` : ""}

Provide a comprehensive analysis including:
1. Overall score (0-10)
2. Communication score (0-10) - clarity, structure, articulation
3. Technical score (0-10) - depth of knowledge, accuracy
4. Problem-solving score (0-10) - analytical thinking, approach
5. Confidence score (0-10) - assertiveness, conviction
6. Detailed feedback paragraph
7. 2-4 key strengths
8. 2-3 areas for improvement

Return response as JSON with this exact structure:
{
  "score": number,
  "communicationScore": number,
  "technicalScore": number,
  "problemSolvingScore": number,
  "confidenceScore": number,
  "feedback": string,
  "strengths": string[],
  "improvements": string[]
}`

    try {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        model: getModel(),
        temperature: 0.5,
        max_tokens: 1500,
        response_format: { type: "json_object" }
      })

      const content = completion.choices[0]?.message?.content || "{}"
      const analysis = JSON.parse(content)

      // Ensure all required fields exist with defaults
      return {
        score: analysis.score || 5,
        communicationScore: analysis.communicationScore || 5,
        technicalScore: analysis.technicalScore || 5,
        problemSolvingScore: analysis.problemSolvingScore || 5,
        confidenceScore: analysis.confidenceScore || 5,
        feedback: analysis.feedback || "Good response. Consider providing more specific examples.",
        strengths: Array.isArray(analysis.strengths) ? analysis.strengths : ["Clear communication"],
        improvements: Array.isArray(analysis.improvements) ? analysis.improvements : ["Add more detail"]
      }
    } catch (error) {
      console.error("Error analyzing response with Groq:", error)
      // Return fallback analysis
      return generateFallbackAnalysis(answer)
    }
  }

  /**
   * Extract skills and information from resume text
   */
  static async analyzeResume(resumeText: string): Promise<{
    skills: string[]
    experience: string
    suggestedQuestions: string[]
  }> {
    const prompt = `Analyze the following resume and extract:
1. Key technical skills and technologies
2. Years of experience (estimate)
3. Suggest 5 relevant interview questions based on the resume

Resume:
${resumeText.substring(0, 4000)}

Return as JSON with this structure:
{
  "skills": string[],
  "experience": string,
  "suggestedQuestions": string[]
}`

    try {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        model: getModel(),
        temperature: 0.6,
        max_tokens: 2000,
        response_format: { type: "json_object" }
      })

      const content = completion.choices[0]?.message?.content || "{}"
      const analysis = JSON.parse(content)

      return {
        skills: Array.isArray(analysis.skills) ? analysis.skills : [],
        experience: analysis.experience || "Unknown",
        suggestedQuestions: Array.isArray(analysis.suggestedQuestions)
          ? analysis.suggestedQuestions
          : []
      }
    } catch (error) {
      console.error("Error analyzing resume with Groq:", error)
      return {
        skills: [],
        experience: "Unknown",
        suggestedQuestions: []
      }
    }
  }

  /**
   * Generate insights from interview session data
   */
  static async generateInsights(params: {
    responses: Array<{ question: string; answer: string; score: number }>
    overallScore: number
  }): Promise<{
    summary: string
    keyStrengths: string[]
    areasToImprove: string[]
    recommendations: string[]
  }> {
    const { responses, overallScore } = params

    const prompt = `Analyze this interview session and provide insights:

Overall Score: ${overallScore}/10

Responses:
${responses.map((r, i) => `Q${i + 1}: ${r.question}\nA: ${r.answer}\nScore: ${r.score}/10`).join("\n\n")}

Provide:
1. A summary of overall performance
2. 3-5 key strengths demonstrated
3. 3-5 areas that need improvement
4. 3-5 actionable recommendations

Return as JSON:
{
  "summary": string,
  "keyStrengths": string[],
  "areasToImprove": string[],
  "recommendations": string[]
}`

    try {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        model: getModel(),
        temperature: 0.6,
        max_tokens: 2000,
        response_format: { type: "json_object" }
      })

      const content = completion.choices[0]?.message?.content || "{}"
      const insights = JSON.parse(content)

      return {
        summary: insights.summary || "Session completed successfully.",
        keyStrengths: Array.isArray(insights.keyStrengths) ? insights.keyStrengths : [],
        areasToImprove: Array.isArray(insights.areasToImprove) ? insights.areasToImprove : [],
        recommendations: Array.isArray(insights.recommendations) ? insights.recommendations : []
      }
    } catch (error) {
      console.error("Error generating insights with Groq:", error)
      return {
        summary: "Session completed.",
        keyStrengths: ["Completed all questions"],
        areasToImprove: ["Continue practicing"],
        recommendations: ["Schedule regular practice sessions"]
      }
    }
  }
}

// Fallback functions for when AI is unavailable
function generateFallbackQuestions(role: string, count: number): string[] {
  const generic = [
    "Tell me about your background and experience in this field.",
    "What interests you most about this role?",
    "Describe a challenging project you've worked on recently.",
    "How do you approach problem-solving in your work?",
    "What are your key strengths and how do they apply to this role?",
    "Tell me about a time you had to learn something new quickly.",
    "How do you handle feedback and criticism?",
    "Where do you see yourself in the next few years?",
    "What motivates you in your professional life?",
    "Do you have any questions for us?"
  ]
  return generic.slice(0, count)
}

function generateFallbackAnalysis(answer: string) {
  const wordCount = answer.split(/\s+/).length
  const hasExamples = /for example|for instance|such as|in my experience/i.test(answer)
  const hasMetrics = /\d+%|\d+ percent|\$\d+|increased|decreased|improved/i.test(answer)

  const baseScore = Math.min(10, 4 + (wordCount > 50 ? 2 : 0) + (hasExamples ? 2 : 0) + (hasMetrics ? 2 : 0))

  return {
    score: baseScore,
    communicationScore: Math.min(10, baseScore + 1),
    technicalScore: Math.min(10, baseScore - 1),
    problemSolvingScore: baseScore,
    confidenceScore: baseScore,
    feedback: "Good response. Consider adding more specific examples and quantifiable results to strengthen your answer.",
    strengths: [
      "Clear communication",
      ...(hasExamples ? ["Used specific examples"] : []),
      ...(hasMetrics ? ["Included measurable results"] : [])
    ],
    improvements: [
      ...(!hasExamples ? ["Add concrete examples from your experience"] : []),
      ...(!hasMetrics ? ["Include quantifiable achievements"] : []),
      ...(wordCount < 50 ? ["Provide more detailed responses"] : [])
    ]
  }
}

export default GroqService
