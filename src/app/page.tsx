"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, Lightbulb, Users, Zap, CheckCircle, Star, Play, Sparkles, BarChart, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false)

  // Color mapping for gradients - Tailwind requires static class names
  const gradientMap: Record<string, string> = {
    violet: "bg-gradient-to-br from-violet-500 to-violet-600",
    amber: "bg-gradient-to-br from-amber-500 to-amber-600",
    emerald: "bg-gradient-to-br from-emerald-500 to-emerald-600",
    blue: "bg-gradient-to-br from-blue-500 to-blue-600",
    rose: "bg-gradient-to-br from-rose-500 to-rose-600",
    purple: "bg-gradient-to-br from-purple-500 to-purple-600",
  }

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">PrepAI</span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors">
                How it Works
              </a>
              <a href="#testimonials" className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors">
                Testimonials
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/sign-in">
                <Button variant="ghost" className="text-slate-700 hover:text-slate-900 hover:bg-slate-100">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-violet-600 hover:bg-violet-700 text-white shadow-md">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <div className="inline-flex items-center space-x-2 bg-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Interview Platform</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight">
              Master Interviews with
              <span className="block bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent mt-2">
                AI-Powered Practice
              </span>
            </h1>

            <p className="text-xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Transform your interview preparation with realistic AI conversations.
              Get instant feedback, improve your skills, and land your dream job with confidence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/sign-up">
                <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all">
                  Start Practicing Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg border-slate-300 hover:border-violet-600 hover:text-violet-600 transition-all">
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </div>

            <div className="mt-16 flex items-center justify-center space-x-8 text-sm text-slate-600">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Free forever plan</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Everything you need to excel
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Powerful features designed to help you prepare, practice, and perform at your best
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Lightbulb,
                title: "AI-Powered Interviews",
                description: "Practice with intelligent AI interviewers that adapt to your responses and simulate real interview scenarios.",
                color: "violet"
              },
              {
                icon: Zap,
                title: "Instant Feedback",
                description: "Get detailed performance analysis with actionable insights to improve your communication and technical skills.",
                color: "amber"
              },
              {
                icon: Users,
                title: "Multiple Interviewers",
                description: "Choose from various AI personalities to practice different interview styles and difficulty levels.",
                color: "emerald"
              },
              {
                icon: BarChart,
                title: "Performance Analytics",
                description: "Track your progress over time with detailed metrics and identify areas for improvement.",
                color: "blue"
              },
              {
                icon: Clock,
                title: "Real-Time Practice",
                description: "Engage in voice-based interviews that feel natural and provide immediate response evaluation.",
                color: "rose"
              },
              {
                icon: Sparkles,
                title: "Resume-Based Questions",
                description: "Upload your resume and get personalized questions based on your experience and skills.",
                color: "purple"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-8 rounded-2xl bg-slate-50 hover:bg-white border-2 border-transparent hover:border-violet-200 transition-all duration-300 hover:shadow-lg"
              >
                <div className={`w-12 h-12 ${gradientMap[feature.color] || gradientMap.violet} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              How PrepAI Works
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Get started in minutes and transform your interview skills
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Sign Up", description: "Create your free account in seconds" },
              { step: "2", title: "Choose Interviewer", description: "Select AI interviewer based on your goals" },
              { step: "3", title: "Practice", description: "Engage in realistic voice conversations" },
              { step: "4", title: "Improve", description: "Review feedback and track progress" }
            ].map((item, index) => (
              <div key={index} className="text-center relative">
                {index < 3 && (
                  <div className="hidden md:block absolute top-6 left-1/2 w-full h-0.5 bg-gradient-to-r from-violet-200 to-transparent" />
                )}
                <div className="relative bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold shadow-lg">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600 text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Trusted by professionals worldwide
            </h2>
            <div className="flex justify-center items-center space-x-2 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-amber-400 fill-current" />
              ))}
            </div>
            <p className="text-slate-600">4.9/5 from 1,000+ users</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Software Engineer at Google",
                content: "PrepAI helped me land my dream job. The AI feedback was incredibly detailed and the voice practice made all the difference.",
                initials: "SJ"
              },
              {
                name: "Michael Chen",
                role: "Product Manager at Microsoft",
                content: "The variety of interview scenarios and instant feedback helped me improve dramatically in just two weeks of practice.",
                initials: "MC"
              },
              {
                name: "Emily Rodriguez",
                role: "Data Scientist at Meta",
                content: "From nervous to confident in a few sessions. The analytics helped me identify exactly where I needed to improve.",
                initials: "ER"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-slate-50 p-8 rounded-2xl border border-slate-200 hover:border-violet-200 transition-colors">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                    {testimonial.initials}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-slate-900">{testimonial.name}</h4>
                    <p className="text-slate-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed">{testimonial.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-violet-600 to-indigo-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to ace your next interview?
          </h2>
          <p className="text-xl text-violet-100 mb-10">
            Join thousands of successful candidates who transformed their interview skills with PrepAI
          </p>
          <Link href="/sign-up">
            <Button size="lg" className="bg-white text-violet-600 hover:bg-slate-50 px-10 py-6 text-lg font-semibold shadow-2xl hover:shadow-xl transition-all">
              Start Your Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">PrepAI</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                AI-powered interview preparation platform helping professionals land their dream jobs.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8">
            <p className="text-center text-slate-400 text-sm">
              © 2024 PrepAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
