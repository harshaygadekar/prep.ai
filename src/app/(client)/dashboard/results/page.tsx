"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Trophy,
  Star,
  TrendingUp,
  Clock,
  Target,
  MessageSquare,
  Download,
  Share,
  Eye,
  Calendar,
  User,
  BarChart,
  BadgeCheck,
  CheckCircle,
  AlertCircle,
  XCircle
} from "lucide-react"
import { useInterviews } from "@/contexts/interviews.context"

interface InterviewResult {
  id: string
  interviewName: string
  candidateName: string
  completedAt: Date
  duration: string
  overallScore: number
  responses: {
    question: string
    answer: string
    score: number
    feedback: string
    strengths: string[]
    improvements: string[]
  }[]
  skills: {
    communication: number
    technical: number
    problemSolving: number
    confidence: number
  }
}

function Results() {
  const { interviews } = useInterviews()
  const [selectedResult, setSelectedResult] = useState<InterviewResult | null>(null)
  const [results, setResults] = useState<InterviewResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch results data
  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch('/api/scoring')

        if (!response.ok) {
          throw new Error(`Failed to fetch results: ${response.statusText}`)
        }

        const data = await response.json()

        if (data.success && data.scores.length > 0) {
          const apiResults: InterviewResult[] = data.scores.map((score: any) => ({
            id: score.id,
            interviewName: "Interview Session",
            candidateName: "Current User",
            completedAt: new Date(score.timestamp),
            duration: "15m 30s",
            overallScore: score.overallScore,
            responses: [{
              question: "Sample question from the interview",
              answer: "Sample response provided by the candidate",
              score: score.overallScore,
              feedback: "AI-generated feedback based on the response",
              strengths: ["Clear communication", "Good examples"],
              improvements: ["Add more details", "Provide metrics"]
            }],
            skills: {
              communication: score.breakdown.communication,
              technical: score.breakdown.technical,
              problemSolving: score.breakdown.problemSolving,
              confidence: score.breakdown.confidence
            }
          }))
          setResults(apiResults)
          setIsLoading(false)
          return
        }

        // No results from API, use mock data as fallback
        const mockResults: InterviewResult[] = [
          {
            id: "1",
            interviewName: "Software Engineer Interview",
            candidateName: "John Doe",
            completedAt: new Date("2024-01-15T10:30:00"),
            duration: "18m 45s",
            overallScore: 8.5,
            responses: [
              {
                question: "Tell me about yourself and your background.",
                answer: "I'm a software engineer with 3 years of experience in full-stack development...",
                score: 9.0,
                feedback: "Excellent introduction with clear structure and relevant details.",
                strengths: ["Clear communication", "Relevant experience", "Confident delivery"],
                improvements: ["Could mention specific achievements", "Add more technical details"]
              },
              {
                question: "Describe a challenging project you've worked on.",
                answer: "I worked on a microservices architecture project that required...",
                score: 8.5,
                feedback: "Good technical explanation with problem-solving approach.",
                strengths: ["Technical depth", "Problem-solving skills", "Results-oriented"],
                improvements: ["Could elaborate on team collaboration", "Mention metrics"]
              }
            ],
            skills: {
              communication: 8.8,
              technical: 8.2,
              problemSolving: 8.5,
              confidence: 8.0
            }
          },
          {
            id: "2",
            interviewName: "Product Manager Interview",
            candidateName: "Jane Smith",
            completedAt: new Date("2024-01-14T14:15:00"),
            duration: "22m 12s",
            overallScore: 7.8,
            responses: [
              {
                question: "How do you prioritize product features?",
                answer: "I use a combination of user feedback, business impact, and technical feasibility...",
                score: 8.2,
                feedback: "Strong framework for prioritization with clear methodology.",
                strengths: ["Strategic thinking", "Data-driven approach", "User focus"],
                improvements: ["Could mention specific frameworks", "Add stakeholder management"]
              }
            ],
            skills: {
              communication: 8.5,
              technical: 7.0,
              problemSolving: 8.8,
              confidence: 7.5
            }
          }
        ]
        setResults(mockResults)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching results:', error)
        setError(error instanceof Error ? error.message : 'Failed to load results')
        setIsLoading(false)
      }
    }

    fetchResults()
  }, [])

  const getScoreColor = (score: number) => {
    if (score >= 8.5) return "text-emerald-600 bg-emerald-100 border-emerald-200"
    if (score >= 7.0) return "text-amber-600 bg-amber-100 border-amber-200"
    return "text-rose-600 bg-rose-100 border-rose-200"
  }

  const getScoreIcon = (score: number) => {
    if (score >= 8.5) return <CheckCircle className="h-4 w-4" />
    if (score >= 7.0) return <AlertCircle className="h-4 w-4" />
    return <XCircle className="h-4 w-4" />
  }

  const SkillBar = ({ label, score, color }: { label: string; score: number; color: string }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className="text-sm font-bold text-slate-900">{score.toFixed(1)}/10</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${color}`}
          style={{ width: `${score * 10}%` }}
        ></div>
      </div>
    </div>
  )

  if (selectedResult) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <Button
                variant="outline"
                onClick={() => setSelectedResult(null)}
                className="mb-4"
              >
                Back to Results
              </Button>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                Interview Results
              </h1>
              <p className="text-lg text-slate-600">
                Detailed analysis for {selectedResult.candidateName}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Share className="h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export PDF
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Overview */}
            <div className="lg:col-span-1 space-y-6">
              {/* Overall Score */}
              <Card className="border border-slate-200 shadow-sm">
                <CardHeader className="text-center pb-4">
                  <div className="p-4 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-full w-fit mx-auto mb-4">
                    <Trophy className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle>Overall Score</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-5xl font-bold text-violet-600 mb-2">
                    {selectedResult.overallScore.toFixed(1)}
                  </div>
                  <div className="text-slate-600 mb-4">out of 10</div>
                  <Badge className={`${getScoreColor(selectedResult.overallScore)} px-3 py-1 border`}>
                    {selectedResult.overallScore >= 8.5 ? 'Excellent' :
                     selectedResult.overallScore >= 7.0 ? 'Good' : 'Needs Improvement'}
                  </Badge>
                </CardContent>
              </Card>

              {/* Interview Details */}
              <Card className="border border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5 text-violet-600" />
                    Interview Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Interview:</span>
                    <span className="font-medium">{selectedResult.interviewName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Candidate:</span>
                    <span className="font-medium">{selectedResult.candidateName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Duration:</span>
                    <span className="font-medium">{selectedResult.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Completed:</span>
                    <span className="font-medium">
                      {selectedResult.completedAt.toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Skills Breakdown */}
              <Card className="border border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BarChart className="h-5 w-5 text-violet-600" />
                    Skills Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <SkillBar
                    label="Communication"
                    score={selectedResult.skills.communication}
                    color="bg-blue-500"
                  />
                  <SkillBar
                    label="Technical Knowledge"
                    score={selectedResult.skills.technical}
                    color="bg-emerald-500"
                  />
                  <SkillBar
                    label="Problem Solving"
                    score={selectedResult.skills.problemSolving}
                    color="bg-purple-500"
                  />
                  <SkillBar
                    label="Confidence"
                    score={selectedResult.skills.confidence}
                    color="bg-amber-500"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Detailed Responses */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">Question-by-Question Analysis</h2>

              {selectedResult.responses.map((response, index) => (
                <Card key={index} className="border border-slate-200 shadow-sm">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">
                          Question {index + 1}
                        </CardTitle>
                        <p className="text-slate-700 font-medium">
                          {response.question}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        {getScoreIcon(response.score)}
                        <Badge className={`${getScoreColor(response.score)} px-2 py-1 border`}>
                          {response.score.toFixed(1)}/10
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Answer */}
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">Response:</h4>
                      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <p className="text-slate-700 italic">"{response.answer}"</p>
                      </div>
                    </div>

                    {/* Feedback */}
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">AI Feedback:</h4>
                      <p className="text-slate-700">{response.feedback}</p>
                    </div>

                    {/* Strengths and Improvements */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-emerald-700 mb-2 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Strengths
                        </h4>
                        <ul className="space-y-1">
                          {response.strengths.map((strength, i) => (
                            <li key={i} className="text-sm text-slate-700 flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-orange-700 mb-2 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" />
                          Areas for Improvement
                        </h4>
                        <ul className="space-y-1">
                          {response.improvements.map((improvement, i) => (
                            <li key={i} className="text-sm text-slate-700 flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                              {improvement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    )
  }

  // Show loading state
  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading results...</p>
          </div>
        </div>
      </main>
    )
  }

  // Show error state
  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <Card className="max-w-md mx-auto p-8 border border-rose-200 bg-rose-50">
              <XCircle className="h-16 w-16 text-rose-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Error Loading Results</h3>
              <p className="text-slate-600 mb-4">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                className="bg-violet-600 hover:bg-violet-700"
              >
                Try Again
              </Button>
            </Card>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center">
            <BarChart className="w-10 h-10 text-violet-600 mr-3" />
            Interview Results
          </h1>
          <p className="text-lg text-slate-600">
            View and analyze interview performance and feedback
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Total Results</p>
                <p className="text-2xl font-bold text-slate-900">{results.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-500">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-4 border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Avg Score</p>
                <p className="text-2xl font-bold text-slate-900">
                  {results.length > 0
                    ? (results.reduce((acc, r) => acc + r.overallScore, 0) / results.length).toFixed(1)
                    : '0.0'
                  }
                </p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500">
                <Star className="h-5 w-5 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-4 border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">This Week</p>
                <p className="text-2xl font-bold text-slate-900">
                  {results.filter(r => {
                    const weekAgo = new Date()
                    weekAgo.setDate(weekAgo.getDate() - 7)
                    return r.completedAt > weekAgo
                  }).length}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-purple-500">
                <Calendar className="h-5 w-5 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-4 border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Top Score</p>
                <p className="text-2xl font-bold text-slate-900">
                  {results.length > 0
                    ? Math.max(...results.map(r => r.overallScore)).toFixed(1)
                    : '0.0'
                  }
                </p>
              </div>
              <div className="p-3 rounded-xl bg-amber-500">
                <Trophy className="h-5 w-5 text-white" />
              </div>
            </div>
          </Card>
        </div>

        {/* Results List */}
        <Card className="border border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BadgeCheck className="h-5 w-5 text-violet-600" />
              Recent Interview Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {results.length === 0 ? (
              <div className="text-center py-12">
                <div className="p-6 bg-slate-100 rounded-full w-fit mx-auto mb-4">
                  <BarChart className="h-8 w-8 text-slate-500" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  No Results Yet
                </h3>
                <p className="text-slate-600">
                  Interview results will appear here once candidates complete their sessions.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((result) => (
                  <div
                    key={result.id}
                    className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer bg-white"
                    onClick={() => setSelectedResult(result)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-slate-900">
                            {result.candidateName}
                          </h3>
                          <Badge className={`${getScoreColor(result.overallScore)} px-2 py-1 border`}>
                            {result.overallScore.toFixed(1)}/10
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 mb-1">
                          {result.interviewName}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {result.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {result.completedAt.toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {result.responses.length} questions
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

export default Results
