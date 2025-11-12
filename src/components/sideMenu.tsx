"use client"

import React from "react"
import {
  Play,
  Mic,
  BarChart,
  Settings,
  HelpCircle,
  Zap,
  Target,
  Trophy,
  Home
} from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

function SideMenu() {
  const pathname = usePathname()
  const router = useRouter()

  const menuItems = [
    {
      icon: Home,
      label: "Dashboard",
      path: "/dashboard",
      active: pathname.endsWith("/dashboard"),
      color: "text-violet-600",
      bgColor: "bg-violet-50"
    },
    {
      icon: Play,
      label: "Interviews",
      path: "/dashboard",
      active: pathname.includes("/interviews") && !pathname.endsWith("/dashboard"),
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: Mic,
      label: "AI Interviewers",
      path: "/dashboard/interviewers",
      active: pathname.endsWith("/interviewers"),
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      icon: BarChart,
      label: "Analytics",
      path: "/dashboard/analytics",
      active: pathname.endsWith("/analytics"),
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    },
    {
      icon: Trophy,
      label: "Results",
      path: "/dashboard/results",
      active: pathname.endsWith("/results"),
      color: "text-amber-600",
      bgColor: "bg-amber-50"
    }
  ]

  const bottomItems = [
    {
      icon: Settings,
      label: "Settings",
      path: "/dashboard/settings",
      active: pathname.endsWith("/settings"),
      color: "text-slate-600",
      bgColor: "bg-slate-50"
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      path: "/dashboard/help",
      active: pathname.endsWith("/help"),
      color: "text-slate-600",
      bgColor: "bg-slate-50"
    }
  ]

  return (
    <div className="z-10 bg-white border-r border-slate-200 w-[240px] fixed top-[64px] left-0 h-[calc(100vh-64px)] shadow-sm">
      <div className="flex flex-col h-full p-4">
        {/* Main Navigation */}
        <div className="flex-1">
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-3">
              Main Menu
            </h3>
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.path}
                    onClick={() => router.push(item.path)}
                    className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                      item.active
                        ? `${item.bgColor} ${item.color} shadow-sm`
                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Icon
                      className={`mr-3 h-5 w-5 transition-colors ${
                        item.active ? item.color : "text-slate-400 group-hover:text-slate-600"
                      }`}
                    />
                    {item.label}
                    {item.active && (
                      <div className="ml-auto w-2 h-2 bg-current rounded-full"></div>
                    )}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Quick Stats */}
          <div className="mb-6 p-4 bg-gradient-to-br from-violet-50 to-indigo-50 rounded-xl border border-violet-100">
            <div className="flex items-center mb-2">
              <Zap className="h-4 w-4 text-violet-600 mr-2" />
              <span className="text-sm font-medium text-violet-900">Quick Stats</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-violet-700">This Week</span>
                <span className="font-semibold text-violet-900">5 sessions</span>
              </div>
              <div className="flex justify-between">
                <span className="text-violet-700">Success Rate</span>
                <span className="font-semibold text-violet-900">85%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="border-t border-slate-200 pt-4">
          <nav className="space-y-1">
            {bottomItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    item.active
                      ? `${item.bgColor} ${item.color}`
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {item.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Upgrade Prompt */}
        <div className="mt-4 p-4 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl text-white">
          <div className="text-sm font-medium mb-1">Upgrade to Pro</div>
          <div className="text-xs opacity-90 mb-3">Unlock unlimited interviews</div>
          <button className="w-full bg-white text-violet-600 text-xs font-medium py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors">
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default SideMenu
