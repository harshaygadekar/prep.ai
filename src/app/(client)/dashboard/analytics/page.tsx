"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock, 
  Target,
  Award,
  Calendar,
  MessageSquare
} from "lucide-react";
import { useInterviews } from "@/contexts/interviews.context";

function Analytics() {
  const { interviews } = useInterviews();
  const [analytics, setAnalytics] = useState({
    totalInterviews: 0,
    totalSessions: 0,
    completedSessions: 0,
    avgCompletionRate: 85,
    avgRating: 4.2,
    topPerformingInterview: "",
    weeklyGrowth: 12,
    monthlyActive: 45,
    avgSessionTime: "8m 32s",
    skillBreakdown: {
      communication: 8.5,
      technical: 7.8,
      problemSolving: 8.2,
      confidence: 7.9
    }
  });

  useEffect(() => {
    // Fetch analytics from API
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/analytics');
        const data = await response.json();
        
        if (data.success) {
          setAnalytics(prev => ({
            ...prev,
            totalInterviews: data.data.totalInterviews,
            totalSessions: data.data.totalSessions,
            completedSessions: data.data.completedSessions,
            avgCompletionRate: data.data.completionRate,
            avgRating: data.data.averageScore,
            weeklyGrowth: data.data.weeklyGrowth,
            monthlyActive: data.data.monthlyActive,
            avgSessionTime: data.data.avgSessionTime,
            topPerformingInterview: data.data.recentActivity[0]?.title || "No interviews yet",
            skillBreakdown: data.data.skillBreakdown
          }));
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };

    fetchAnalytics();

    // Calculate from interviews data as fallback
    const totalResponses = interviews.reduce((acc, interview) =>
      acc + Number(interview.responseCount), 0
    );

    const topInterview = interviews.length > 0
      ? interviews.reduce((prev, current) =>
          Number(prev.responseCount) > Number(current.responseCount) ? prev : current
        ).name
      : "No interviews yet";

    setAnalytics(prev => ({
      ...prev,
      totalInterviews: interviews.length,
      topPerformingInterview: topInterview || "No interviews yet"
    }));
  }, [interviews]);

  const StatCard = ({ icon: Icon, title, value, subtitle, trend, color }: any) => (
    <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-2xl ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        {trend && (
          <div className="flex items-center text-green-600 text-sm font-medium">
            <TrendingUp className="h-4 w-4 mr-1" />
            +{trend}%
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
    </Card>
  );

  const SkillBar = ({ label, score, color }: { label: string; score: number; color: string }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-bold text-gray-900">{score.toFixed(1)}/10</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${color}`} 
          style={{ width: `${score * 10}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Analytics Dashboard 📊
          </h1>
          <p className="text-lg text-gray-600">
            Track your interview performance and insights
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Target}
            title="Total Interviews"
            value={analytics.totalInterviews}
            subtitle="Available interviews"
            trend={analytics.weeklyGrowth}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
          />
          <StatCard
            icon={Users}
            title="Total Sessions"
            value={analytics.totalSessions}
            subtitle="Practice sessions"
            trend={15}
            color="bg-gradient-to-r from-green-500 to-green-600"
          />
          <StatCard
            icon={Award}
            title="Avg Rating"
            value={`${analytics.avgRating}/10`}
            subtitle="Performance score"
            color="bg-gradient-to-r from-yellow-500 to-yellow-600"
          />
          <StatCard
            icon={Clock}
            title="Avg Session Time"
            value={analytics.avgSessionTime}
            subtitle="Per interview"
            color="bg-gradient-to-r from-purple-500 to-purple-600"
          />
        </div>

        {/* Charts and Detailed Analytics */}
        {/* TODO: Replace progress bars with @mui/x-charts components for better visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Performance Overview */}
          <Card className="p-6 border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-indigo-600" />
                Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Completion Rate</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-green-500 rounded-full" 
                        style={{ width: `${analytics.avgCompletionRate}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{analytics.avgCompletionRate}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">User Engagement</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-blue-500 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                    <span className="text-sm font-medium">78%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Success Rate</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-purple-500 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                    <span className="text-sm font-medium">92%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills Assessment */}
          <Card className="p-6 border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-indigo-600" />
                Skills Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <SkillBar 
                label="Communication" 
                score={analytics.skillBreakdown.communication} 
                color="bg-blue-500" 
              />
              <SkillBar 
                label="Technical Knowledge" 
                score={analytics.skillBreakdown.technical} 
                color="bg-green-500" 
              />
              <SkillBar 
                label="Problem Solving" 
                score={analytics.skillBreakdown.problemSolving} 
                color="bg-purple-500" 
              />
              <SkillBar 
                label="Confidence" 
                score={analytics.skillBreakdown.confidence} 
                color="bg-yellow-500" 
              />
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="p-6 border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-indigo-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {interviews.slice(0, 5).map((interview, index) => (
                <div key={interview.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <MessageSquare className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{interview.name}</p>
                      <p className="text-sm text-gray-500">
                        {Number(interview.responseCount)} responses
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">Active</p>
                    <p className="text-xs text-gray-500">Updated today</p>
                  </div>
                </div>
              ))}
              {interviews.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No interviews created yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default Analytics;