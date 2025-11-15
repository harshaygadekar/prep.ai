"use client"

import Link from "next/link"
import React, { useState } from "react"
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs"
import { Lightbulb, Sparkles, CheckCircle, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="fixed inset-x-0 top-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-[50] shadow-sm">
      <div className="flex items-center justify-between h-16 gap-4 px-4 md:px-6 mx-auto max-w-7xl">
        <div className="flex items-center gap-6">
          <Link href={"/dashboard"} className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="p-2 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg">
              <Lightbulb className="h-5 w-5 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">
                PrepAI
              </h1>
              <div className="flex items-center gap-1 px-2 py-0.5 bg-violet-100 rounded-full">
                <Sparkles className="h-3 w-3 text-violet-600" />
                <span className="text-xs font-medium text-violet-600">Beta</span>
              </div>
            </div>
          </Link>

          <div className="hidden md:block h-6 w-px bg-slate-300"></div>

          <div className="hidden md:block">
            <OrganizationSwitcher
              afterCreateOrganizationUrl="/dashboard"
              hidePersonal={true}
              afterSelectOrganizationUrl="/dashboard"
              afterLeaveOrganizationUrl="/dashboard"
              appearance={{
                elements: {
                  organizationSwitcherTrigger:
                    "px-4 py-2 rounded-lg border border-slate-200 hover:border-violet-300 hover:bg-violet-50 transition-all duration-200",
                  organizationSwitcherTriggerIcon: "text-violet-600",
                },
                variables: {
                  fontSize: "0.875rem",
                  fontWeight: "500",
                },
              }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">All systems operational</span>
          </div>

          <UserButton
            afterSignOutUrl="/sign-in"
            signInUrl="/sign-in"
            appearance={{
              elements: {
                avatarBox: "w-10 h-10 rounded-full border-2 border-violet-200 hover:border-violet-400 transition-colors",
              },
            }}
          />

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5 text-slate-700" />
            ) : (
              <Menu className="h-5 w-5 text-slate-700" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md">
          <div className="px-4 py-4 space-y-4">
            <div className="pb-3 border-b border-slate-200">
              <p className="text-xs font-medium text-slate-500 mb-2">ORGANIZATION</p>
              <OrganizationSwitcher
                afterCreateOrganizationUrl="/dashboard"
                hidePersonal={true}
                afterSelectOrganizationUrl="/dashboard"
                afterLeaveOrganizationUrl="/dashboard"
                appearance={{
                  elements: {
                    organizationSwitcherTrigger:
                      "w-full px-4 py-2 rounded-lg border border-slate-200 hover:border-violet-300 hover:bg-violet-50 transition-all duration-200",
                    organizationSwitcherTriggerIcon: "text-violet-600",
                  },
                  variables: {
                    fontSize: "0.875rem",
                    fontWeight: "500",
                  },
                }}
              />
            </div>

            <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">All systems operational</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Navbar
