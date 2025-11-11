"use client";

import React, { useState } from "react";
import { Plus, Sparkles, Zap } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import CreateInterviewModal from "@/components/dashboard/interview/createInterviewModal";
import Modal from "@/components/dashboard/Modal";

function CreateInterviewCard() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card
        className="group h-80 bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 border-2 border-dashed border-violet-300 cursor-pointer hover:border-violet-500 hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden flex items-center justify-center"
        onClick={() => {
          setOpen(true);
        }}
      >
        <CardContent className="flex items-center flex-col text-center p-8">
          <div className="relative mb-6">
            {/* Animated background circles */}
            <div className="absolute inset-0 -m-4">
              <div className="w-16 h-16 bg-violet-200 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute top-2 left-2 w-12 h-12 bg-purple-200 rounded-full opacity-30 animate-pulse delay-75"></div>
            </div>

            {/* Main icon */}
            <div className="relative bg-gradient-to-r from-violet-600 to-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Plus className="h-8 w-8 text-white" />
            </div>

            {/* Sparkle effects */}
            <Sparkles className="absolute -top-2 -right-2 h-5 w-5 text-violet-400 animate-bounce" />
            <Zap className="absolute -bottom-1 -left-2 h-4 w-4 text-purple-400 animate-pulse" />
          </div>

          <CardTitle className="text-xl font-bold text-slate-900 mb-2 group-hover:text-violet-600 transition-colors">
            Create New Interview
          </CardTitle>

          <p className="text-sm text-slate-600 mb-4 leading-relaxed">
            Start a new AI-powered interview session and practice your skills
          </p>

          <div className="flex items-center space-x-2 text-xs text-violet-600 font-medium">
            <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse"></div>
            <span>Ready to begin</span>
          </div>

          {/* Hover effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
        </CardContent>
      </Card>

      <Modal
        open={open}
        closeOnOutsideClick={false}
        onClose={() => {
          setOpen(false);
        }}
      >
        <CreateInterviewModal open={open} setOpen={setOpen} />
      </Modal>
    </>
  );
}

export default CreateInterviewCard;
