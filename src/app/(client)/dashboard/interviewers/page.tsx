"use client"

import React, { useState, useEffect, useCallback } from "react"
import { useInterviewers } from "@/contexts/interviewers.context"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Users,
  Plus,
  Sparkles,
  Lightbulb,
  MessageSquare,
  Star,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye
} from "lucide-react"
import Image from "next/image"
import Modal from "@/components/dashboard/Modal"
import CreateInterviewerButton from "@/components/dashboard/interviewer/createInterviewerButton"

function InterviewersPage() {
  const { interviewers, interviewersLoading } = useInterviewers()
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [selectedInterviewer, setSelectedInterviewer] = useState<any>(null)
  const [showDetails, setShowDetails] = useState(false)

  // Debounce search term - wait 300ms after user stops typing
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm])

  // Use debounced search term for better performance
  const filteredInterviewers = interviewers.filter(interviewer => {
    const matchesSearch = interviewer.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                         interviewer.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                         interviewer.personality?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())

    if (selectedFilter === "all") return matchesSearch
    return matchesSearch && interviewer.expertise.some((skill: string) =>
      skill.toLowerCase().includes(selectedFilter.toLowerCase())
    )
  })

  const InterviewerCard = ({ interviewer }: any) => (
    <Card className="group hover:shadow-xl transition-all duration-300 border border-slate-200 bg-white rounded-xl overflow-hidden">
      <CardContent className="p-0">
        {/* Header with gradient */}
        <div className="relative h-32 bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex space-x-2">
              <Button
                size="sm"
                className="h-8 w-8 p-0 bg-white/20 hover:bg-white/30 border-0 backdrop-blur-sm"
                onClick={() => {
                  setSelectedInterviewer(interviewer)
                  setShowDetails(true)
                }}
              >
                <Eye className="h-4 w-4 text-white" />
              </Button>
              <Button
                size="sm"
                className="h-8 w-8 p-0 bg-white/20 hover:bg-white/30 border-0 backdrop-blur-sm"
              >
                <MoreVertical className="h-4 w-4 text-white" />
              </Button>
            </div>
          </div>

          {/* Avatar */}
          <div className="absolute -bottom-8 left-6">
            <div className="w-16 h-16 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg">
              {interviewer.avatarUrl ? (
                <Image
                  src={interviewer.avatarUrl}
                  alt={interviewer.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center">
                  <Lightbulb className="h-8 w-8 text-white" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="pt-12 p-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <CardTitle className="text-lg font-bold text-slate-900 mb-1">
                {interviewer.name}
              </CardTitle>
              <p className="text-sm text-slate-600 mb-3">
                {interviewer.description}
              </p>
            </div>
            <div className="flex items-center space-x-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
              <Star className="w-3 h-3 text-amber-500" />
              <span className="text-xs font-medium text-amber-700">4.9</span>
            </div>
          </div>

          {/* Expertise Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {interviewer.expertise.slice(0, 3).map((skill: string, index: number) => (
              <span
                key={index}
                className="px-2 py-1 bg-violet-50 text-violet-700 text-xs font-medium rounded-lg border border-violet-200"
              >
                {skill}
              </span>
            ))}
            {interviewer.expertise.length > 3 && (
              <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-lg">
                +{interviewer.expertise.length - 3} more
              </span>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
            <div className="text-center">
              <div className="text-lg font-bold text-slate-900">127</div>
              <div className="text-xs text-slate-500">Interviews</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-emerald-600">94%</div>
              <div className="text-xs text-slate-500">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-violet-600">4.9</div>
              <div className="text-xs text-slate-500">Rating</div>
            </div>
          </div>

          {/* Action Button */}
          <Button className="w-full mt-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-lg shadow-md">
            <MessageSquare className="w-4 h-4 mr-2" />
            Start Interview
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const InterviewerDetailsModal = ({ interviewer, onClose }: any) => (
    <div className="w-[600px] max-h-[80vh] overflow-y-auto">
      <div className="relative">
        {/* Header */}
        <div className="h-32 bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600 rounded-t-xl">
          <div className="absolute -bottom-8 left-6">
            <div className="w-16 h-16 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg">
              {interviewer.avatarUrl ? (
                <Image
                  src={interviewer.avatarUrl}
                  alt={interviewer.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center">
                  <Lightbulb className="h-8 w-8 text-white" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="pt-12 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">{interviewer.name}</h2>
              <p className="text-slate-600 mb-4">{interviewer.description}</p>
            </div>
            <div className="flex items-center space-x-1 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200">
              <Star className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-amber-700">4.9</span>
            </div>
          </div>

          {/* Personality */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Personality</h3>
            <p className="text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200">{interviewer.personality}</p>
          </div>

          {/* Expertise */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Areas of Expertise</h3>
            <div className="flex flex-wrap gap-2">
              {interviewer.expertise.map((skill: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-2 bg-violet-50 text-violet-700 text-sm font-medium rounded-lg border border-violet-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Performance Stats */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Performance Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">127</div>
                <div className="text-sm text-blue-700">Total Interviews Conducted</div>
              </div>
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                <div className="text-2xl font-bold text-emerald-600">94%</div>
                <div className="text-sm text-emerald-700">Success Rate</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                <div className="text-2xl font-bold text-purple-600">4.9</div>
                <div className="text-sm text-purple-700">Average Rating</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                <div className="text-2xl font-bold text-orange-600">23 min</div>
                <div className="text-sm text-orange-700">Avg Interview Duration</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-lg">
              <MessageSquare className="w-4 h-4 mr-2" />
              Start Interview
            </Button>
            <Button variant="outline" className="px-6 rounded-lg border-slate-300">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  if (interviewersLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 animate-pulse rounded-xl bg-slate-200" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center">
                <Lightbulb className="w-10 h-10 text-violet-600 mr-3" />
                AI Interviewers
              </h1>
              <p className="text-lg text-slate-600">
                Meet our AI-powered interview specialists, each with unique expertise and personalities
              </p>
            </div>
            <CreateInterviewerButton />
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search interviewers by name or expertise..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white"
              />
            </div>
            <div className="flex space-x-2">
              <Button
                variant={selectedFilter === "all" ? "default" : "outline"}
                onClick={() => setSelectedFilter("all")}
                className="rounded-lg"
              >
                All
              </Button>
              <Button
                variant={selectedFilter === "technical" ? "default" : "outline"}
                onClick={() => setSelectedFilter("technical")}
                className="rounded-lg"
              >
                Technical
              </Button>
              <Button
                variant={selectedFilter === "behavioral" ? "default" : "outline"}
                onClick={() => setSelectedFilter("behavioral")}
                className="rounded-lg"
              >
                Behavioral
              </Button>
              <Button
                variant={selectedFilter === "leadership" ? "default" : "outline"}
                onClick={() => setSelectedFilter("leadership")}
                className="rounded-lg"
              >
                Leadership
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-4 border border-slate-200 shadow-sm bg-white rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Interviewers</p>
                  <p className="text-2xl font-bold text-slate-900">{interviewers.length}</p>
                </div>
                <Users className="w-8 h-8 text-violet-600" />
              </div>
            </Card>
            <Card className="p-4 border border-slate-200 shadow-sm bg-white rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Active Sessions</p>
                  <p className="text-2xl font-bold text-emerald-600">12</p>
                </div>
                <MessageSquare className="w-8 h-8 text-emerald-600" />
              </div>
            </Card>
            <Card className="p-4 border border-slate-200 shadow-sm bg-white rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Avg Rating</p>
                  <p className="text-2xl font-bold text-amber-600">4.8</p>
                </div>
                <Star className="w-8 h-8 text-amber-600" />
              </div>
            </Card>
            <Card className="p-4 border border-slate-200 shadow-sm bg-white rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Success Rate</p>
                  <p className="text-2xl font-bold text-purple-600">92%</p>
                </div>
                <Sparkles className="w-8 h-8 text-purple-600" />
              </div>
            </Card>
          </div>
        </div>

        {/* Interviewers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInterviewers.map((interviewer) => (
            <InterviewerCard key={interviewer.id} interviewer={interviewer} />
          ))}
        </div>

        {filteredInterviewers.length === 0 && (
          <div className="text-center py-12">
            <div className="p-8 bg-white rounded-2xl shadow-md border border-slate-200 max-w-md mx-auto">
              <Lightbulb className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                No interviewers found
              </h3>
              <p className="text-slate-600 mb-4">
                Try adjusting your search or filter criteria
              </p>
              <CreateInterviewerButton />
            </div>
          </div>
        )}

        {/* Details Modal */}
        <Modal
          open={showDetails}
          onClose={() => {
            setShowDetails(false)
            setSelectedInterviewer(null)
          }}
        >
          {selectedInterviewer && (
            <InterviewerDetailsModal
              interviewer={selectedInterviewer}
              onClose={() => {
                setShowDetails(false)
                setSelectedInterviewer(null)
              }}
            />
          )}
        </Modal>
      </div>
    </div>
  )
}

export default InterviewersPage
