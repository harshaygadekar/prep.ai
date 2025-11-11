"use client";

import React, { useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  HelpCircle,
  Search,
  MessageSquare,
  Mail,
  Phone,
  BookOpen,
  Video,
  FileText,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Send,
  Star,
  Clock,
  CheckCircle,
  Sparkles
} from "lucide-react";

function HelpPage() {
  const [activeCategory, setActiveCategory] = useState("getting-started");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [supportForm, setSupportForm] = useState({
    subject: "",
    message: "",
    priority: "medium"
  });

  const categories = [
    { id: "getting-started", label: "Getting Started", icon: BookOpen },
    { id: "interviews", label: "Interviews", icon: MessageSquare },
    { id: "ai-interviewers", label: "AI Interviewers", icon: HelpCircle },
    { id: "analytics", label: "Analytics & Results", icon: FileText },
    { id: "billing", label: "Billing & Plans", icon: Star },
    { id: "technical", label: "Technical Issues", icon: Video }
  ];

  const faqs: Record<string, Array<{question: string, answer: string}>> = {
    "getting-started": [
      {
        question: "How do I create my first interview?",
        answer: "To create your first interview, click on the 'Create Interview' button on your dashboard. Fill in the interview details, select an AI interviewer, and configure your questions. You can either generate questions automatically or create them manually."
      },
      {
        question: "What is PrepAI and how does it work?",
        answer: "PrepAI is an AI-powered interview platform that helps you practice and improve your interview skills. Our AI interviewers conduct realistic interviews, provide detailed feedback, and help you identify areas for improvement."
      },
      {
        question: "How do I upload my resume for AI question generation?",
        answer: "When creating an interview, you'll see a resume upload section. Simply drag and drop your resume file (PDF, DOC, DOCX, or TXT) and our AI will analyze it to generate personalized interview questions based on your experience and skills."
      }
    ],
    "interviews": [
      {
        question: "How long do interviews typically last?",
        answer: "Interview duration can be customized when creating an interview, typically ranging from 5 to 30 minutes. The AI interviewer will adapt to your chosen timeframe and ask appropriate follow-up questions."
      },
      {
        question: "Can I pause an interview and resume later?",
        answer: "Yes, you can pause an interview at any time and resume it later. Your progress will be saved automatically, and you can continue from where you left off."
      },
      {
        question: "What types of questions do AI interviewers ask?",
        answer: "AI interviewers ask a variety of questions including behavioral, technical, situational, and role-specific questions. The questions are tailored based on your resume, the job role, and the interviewer's expertise."
      }
    ],
    "ai-interviewers": [
      {
        question: "How are AI interviewers different from each other?",
        answer: "Each AI interviewer has a unique personality, expertise area, and interview style. Some focus on technical skills, others on behavioral aspects, and some specialize in leadership or specific industries."
      },
      {
        question: "Can I create custom AI interviewers?",
        answer: "Yes, with a Pro plan, you can create custom AI interviewers tailored to specific roles, industries, or interview styles. You can define their personality, expertise, and question preferences."
      }
    ],
    "analytics": [
      {
        question: "How is my interview performance scored?",
        answer: "Our AI analyzes multiple factors including communication clarity, technical accuracy, confidence, problem-solving approach, and relevance of answers. You receive scores in different categories along with detailed feedback."
      },
      {
        question: "What insights can I get from my interview results?",
        answer: "You'll receive comprehensive analytics including performance trends, skill assessments, strengths and improvement areas, comparison with industry benchmarks, and personalized recommendations for improvement."
      }
    ],
    "billing": [
      {
        question: "What's included in the free plan?",
        answer: "The free plan includes 10 interview sessions per month, basic AI feedback, access to standard AI interviewers, and email support."
      },
      {
        question: "How do I upgrade to Pro?",
        answer: "You can upgrade to Pro from your dashboard or billing settings. Pro includes unlimited interviews, advanced analytics, custom AI interviewers, priority support, and more features."
      }
    ],
    "technical": [
      {
        question: "What browsers are supported?",
        answer: "PrepAI works best on modern browsers including Chrome, Firefox, Safari, and Edge. We recommend using the latest version for the best experience."
      },
      {
        question: "I'm having audio/video issues during interviews",
        answer: "Make sure your browser has permission to access your microphone and camera. Check your internet connection and try refreshing the page. If issues persist, contact our support team."
      }
    ]
  };

  const resources = [
    {
      title: "Video Tutorials",
      description: "Step-by-step video guides for all features",
      icon: Video,
      link: "#",
      type: "video"
    },
    {
      title: "User Guide",
      description: "Comprehensive documentation and best practices",
      icon: BookOpen,
      link: "#",
      type: "guide"
    },
    {
      title: "API Documentation",
      description: "Technical documentation for developers",
      icon: FileText,
      link: "#",
      type: "api"
    }
  ];

  const filteredFaqs = faqs[activeCategory]?.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle support form submission
    console.log("Support form submitted:", supportForm);
    // Reset form
    setSupportForm({ subject: "", message: "", priority: "medium" });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center">
            <HelpCircle className="w-10 h-10 text-violet-600 mr-3" />
            Help & Support
          </h1>
          <p className="text-lg text-slate-600">
            Find answers to your questions and get the help you need
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border border-slate-200 shadow-sm rounded-xl hover:shadow-md transition-all duration-300 cursor-pointer bg-white">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Live Chat</h3>
              <p className="text-slate-600 text-sm mb-4">Get instant help from our support team</p>
              <div className="flex items-center justify-center text-emerald-600 text-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                Online now
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 shadow-sm rounded-xl hover:shadow-md transition-all duration-300 cursor-pointer bg-white">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Email Support</h3>
              <p className="text-slate-600 text-sm mb-4">Send us a detailed message</p>
              <div className="flex items-center justify-center text-slate-600 text-sm">
                <Clock className="w-4 h-4 mr-1" />
                24h response time
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 shadow-sm rounded-xl hover:shadow-md transition-all duration-300 cursor-pointer bg-white">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Phone Support</h3>
              <p className="text-slate-600 text-sm mb-4">Speak directly with our team</p>
              <div className="text-slate-600 text-sm">
                Pro plan only
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQ Section */}
          <div className="lg:col-span-2">
            <Card className="border border-slate-200 shadow-sm rounded-xl bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <CardTitle className="text-xl font-semibold text-slate-900">Frequently Asked Questions</CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search FAQs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent w-64 bg-white"
                    />
                  </div>
                </div>

                {/* Category Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          activeCategory === category.id
                            ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {category.label}
                      </button>
                    );
                  })}
                </div>

                {/* FAQ List */}
                <div className="space-y-4">
                  {filteredFaqs.map((faq, index) => (
                    <div key={index} className="border border-slate-200 rounded-lg bg-white">
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                      >
                        <span className="font-medium text-slate-900">{faq.question}</span>
                        {expandedFaq === index ? (
                          <ChevronDown className="w-5 h-5 text-slate-500" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-slate-500" />
                        )}
                      </button>
                      {expandedFaq === index && (
                        <div className="px-4 pb-4 text-slate-600 border-t border-slate-100">
                          <p className="pt-4">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {filteredFaqs.length === 0 && (
                  <div className="text-center py-8">
                    <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No FAQs found</h3>
                    <p className="text-slate-600">Try adjusting your search or browse different categories</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Form */}
            <Card className="border border-slate-200 shadow-sm rounded-xl bg-white">
              <CardContent className="p-6">
                <CardTitle className="text-lg font-semibold text-slate-900 mb-4">Contact Support</CardTitle>
                <form onSubmit={handleSupportSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                    <input
                      type="text"
                      value={supportForm.subject}
                      onChange={(e) => setSupportForm(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white"
                      placeholder="Brief description of your issue"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
                    <select
                      value={supportForm.priority}
                      onChange={(e) => setSupportForm(prev => ({ ...prev, priority: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                    <textarea
                      value={supportForm.message}
                      onChange={(e) => setSupportForm(prev => ({ ...prev, message: e.target.value }))}
                      rows={4}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white"
                      placeholder="Describe your issue in detail..."
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Resources */}
            <Card className="border border-slate-200 shadow-sm rounded-xl bg-white">
              <CardContent className="p-6">
                <CardTitle className="text-lg font-semibold text-slate-900 mb-4">Helpful Resources</CardTitle>
                <div className="space-y-3">
                  {resources.map((resource, index) => {
                    const Icon = resource.icon;
                    return (
                      <a
                        key={index}
                        href={resource.link}
                        className="flex items-center p-3 rounded-lg hover:bg-slate-50 transition-colors group"
                      >
                        <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center mr-3">
                          <Icon className="w-5 h-5 text-violet-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-900 group-hover:text-violet-600">
                            {resource.title}
                          </h4>
                          <p className="text-sm text-slate-600">{resource.description}</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-violet-600" />
                      </a>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Status */}
            <Card className="border border-slate-200 shadow-sm rounded-xl bg-white">
              <CardContent className="p-6">
                <CardTitle className="text-lg font-semibold text-slate-900 mb-4">System Status</CardTitle>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">API Services</span>
                    <div className="flex items-center text-emerald-600">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      <span className="text-sm">Operational</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">AI Interviewers</span>
                    <div className="flex items-center text-emerald-600">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      <span className="text-sm">Operational</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Analytics</span>
                    <div className="flex items-center text-emerald-600">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      <span className="text-sm">Operational</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HelpPage;
