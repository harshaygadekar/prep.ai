"use client"

import React, { useState, useEffect } from "react"
import { useOrganization, useUser } from "@clerk/nextjs"
import InterviewCard from "@/components/dashboard/interview/interviewCard"
import CreateInterviewCard from "@/components/dashboard/interview/createInterviewCard"
import { Card } from "@/components/ui/card"
import { useInterviews } from "@/contexts/interviews.context"
import Modal from "@/components/dashboard/Modal"
import {
  Plus,
  TrendingUp,
  Users,
  MessageSquare,
  Flag,
  Sparkles,
  BadgeCheck,
  BarChart,
  Clock
} from "lucide-react"

function Interviews() {
  const { interviews, interviewsLoading } = useInterviews()
  const { organization } = useOrganization()
  const { user } = useUser()
  const [loading, setLoading] = useState<boolean>(false)
  const [currentPlan, setCurrentPlan] = useState<string>("")
  const [allowedResponsesCount, setAllowedResponsesCount] = useState<number>(10)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [stats, setStats] = useState({
    totalInterviews: 0,
    totalResponses: 0,
    avgRating: 4.8,
    completionRate: 85
  })

  function InterviewsLoader() {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-64 animate-pulse rounded-xl bg-slate-200" />
        ))}
      </div>
    )
  }

  function StatsCard({ icon: Icon, title, value, subtitle, colorClass }: any) {
    return (
      <Card className="p-6 border border-slate-200 bg-white hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-slate-900">{value}</p>
            {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
          </div>
          <div className={`p-3 rounded-xl ${colorClass}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </Card>
    )
  }

  useEffect(() => {
    if (organization?.id) {
      setCurrentPlan("free")
      setAllowedResponsesCount(10)
    }
  }, [organization])

  useEffect(() => {
    if (organization && currentPlan === "free") {
      const totalResponses = interviews.reduce((acc, interview) => acc + Number(interview.response_count), 0)
      const hasExceededLimit = totalResponses >= allowedResponsesCount

      if (hasExceededLimit) {
        setCurrentPlan("free_trial_over")
      }
    }
  }, [organization, currentPlan, allowedResponsesCount, interviews])

  useEffect(() => {
    // TODO: API Integration needed for avgRating and completionRate
    // These should be fetched from /api/analytics endpoint
    setStats({
      totalInterviews: interviews.length,
      totalResponses: interviews.reduce((acc, interview) => acc + Number(interview.response_count), 0),
      avgRating: 4.8, // Hardcoded - needs API integration
      completionRate: 85 // Hardcoded - needs API integration
    })
  }, [interviews])

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                Welcome back, {user?.firstName || 'there'}
              </h1>
              <p className="text-lg text-slate-600">
                Ready to practice and improve your interview skills?
              </p>
            </div>
            <div className="flex items-center space-x-2 bg-white border border-slate-200 px-4 py-2 rounded-lg shadow-sm">
              <Sparkles className="h-5 w-5 text-violet-600" />
              <span className="text-sm font-medium text-slate-700">
                {currentPlan === "pro" ? "Pro Plan" : "Free Plan"}
              </span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              icon={Flag}
              title="Total Interviews"
              value={stats.totalInterviews}
              subtitle="Created"
              colorClass="bg-blue-500"
            />
            <StatsCard
              icon={Users}
              title="Total Responses"
              value={stats.totalResponses}
              subtitle="Collected"
              colorClass="bg-green-500"
            />
            <StatsCard
              icon={BadgeCheck}
              title="Average Rating"
              value={`${stats.avgRating}/5`}
              subtitle="User satisfaction"
              colorClass="bg-amber-500"
            />
            <StatsCard
              icon={TrendingUp}
              title="Completion Rate"
              value={`${stats.completionRate}%`}
              subtitle="Success rate"
              colorClass="bg-violet-600"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card
              className="p-6 border-0 bg-gradient-to-br from-violet-600 to-indigo-600 text-white hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => {/* Create interview modal logic */ }}
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Plus className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Create Interview</h3>
                  <p className="text-sm opacity-90">Start a new practice session</p>
                </div>
              </div>
            </Card>

            <Card
              className="p-6 border-0 bg-gradient-to-br from-emerald-500 to-green-600 text-white hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => window.location.href = '/dashboard/results'}
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">View Responses</h3>
                  <p className="text-sm opacity-90">Check your progress</p>
                </div>
              </div>
            </Card>

            <Card
              className="p-6 border-0 bg-gradient-to-br from-orange-500 to-rose-600 text-white hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => window.location.href = '/dashboard/analytics'}
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <BarChart className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">View Analytics</h3>
                  <p className="text-sm opacity-90">Track performance</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Interviews Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Your Interview Sessions
            </h2>
            <div className="text-sm text-slate-600 bg-white px-4 py-2 rounded-lg border border-slate-200">
              {interviews.length} {interviews.length === 1 ? 'session' : 'sessions'} created
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPlan === "free_trial_over" ? (
              <Card className="p-8 border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="text-center">
                  <div className="p-4 bg-slate-200 rounded-full w-fit mx-auto mb-4">
                    <Plus className="h-8 w-8 text-slate-500" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">Upgrade Required</h3>
                  <p className="text-sm text-slate-600">
                    You've reached your free plan limit. Upgrade to continue creating interviews.
                  </p>
                </div>
              </Card>
            ) : (
              <CreateInterviewCard />
            )}

            {interviewsLoading || loading ? (
              <InterviewsLoader />
            ) : (
              interviews.map((item) => (
                <InterviewCard
                  id={item.id}
                  interviewerId={item.interviewer_id}
                  key={item.id}
                  name={item.name}
                  url={item.url ?? ""}
                  readableSlug={item.readable_slug}
                />
              ))
            )}
          </div>

          {interviews.length === 0 && !interviewsLoading && !loading && (
            <div className="text-center py-16">
              <div className="p-8 bg-white rounded-2xl shadow-md border border-slate-200 max-w-lg mx-auto">
                <div className="p-4 bg-violet-100 rounded-full w-fit mx-auto mb-4">
                  <Flag className="h-10 w-10 text-violet-600" />
                </div>
                <h3 className="text-2xl font-semibold text-slate-900 mb-2">
                  Start Your First Interview
                </h3>
                <p className="text-slate-600 mb-6">
                  Create your first AI-powered interview session and begin improving your skills.
                </p>
                <CreateInterviewCard />
              </div>
            </div>
          )}
        </div>

        {/* Upgrade Modal */}
        {isModalOpen && (
          <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <div className="p-8 max-w-2xl">
              <div className="text-center mb-6">
                <div className="p-4 bg-violet-100 rounded-full w-fit mx-auto mb-4">
                  <Sparkles className="h-10 w-10 text-violet-600" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-3">
                  Upgrade to PrepAI Pro
                </h3>
                <p className="text-slate-600 text-lg">
                  You've reached your free plan limit. Upgrade to unlock unlimited interviews and advanced features.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="p-6 border-2 border-slate-200 rounded-xl bg-white">
                  <h4 className="text-lg font-semibold text-slate-900 mb-3">Free Plan</h4>
                  <ul className="space-y-3 text-slate-600">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-slate-400 rounded-full mr-3"></div>
                      10 Interview responses
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-slate-400 rounded-full mr-3"></div>
                      Basic AI feedback
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-slate-400 rounded-full mr-3"></div>
                      Email support
                    </li>
                  </ul>
                </div>

                <div className="p-6 border-2 border-violet-200 bg-violet-50 rounded-xl">
                  <h4 className="text-lg font-semibold text-violet-900 mb-3">Pro Plan</h4>
                  <ul className="space-y-3 text-violet-700">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-violet-500 rounded-full mr-3"></div>
                      Unlimited responses
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-violet-500 rounded-full mr-3"></div>
                      Advanced AI analysis
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-violet-500 rounded-full mr-3"></div>
                      Priority support
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-violet-500 rounded-full mr-3"></div>
                      Custom interviewers
                    </li>
                  </ul>
                </div>
              </div>

              <div className="text-center">
                <p className="text-slate-600 mb-4">
                  Ready to unlock your full potential?
                </p>
                <p className="text-sm text-slate-500">
                  Contact{" "}
                  <span className="font-semibold text-violet-600">support@prepai.co</span>{" "}
                  to upgrade your plan.
                </p>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </main>
  )
}

export default Interviews
