import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, Users, Calendar, TrendingUp, CheckCircle } from "lucide-react";
import axios from "axios";
import MiniLoader from "@/components/loaders/mini-loader/miniLoader";

interface Props {
  name: string | null;
  interviewerId: string;
  id: string;
  url: string;
  readableSlug: string;
}

const base_url = process.env.NEXT_PUBLIC_LIVE_URL;

function InterviewCard({ name, interviewerId, id, url, readableSlug }: Props) {
  const [copied, setCopied] = useState(false);
  const [responseCount, setResponseCount] = useState<number | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [img, setImg] = useState("");
  const [interviewerName, setInterviewerName] = useState("");

  useEffect(() => {
    const fetchInterviewer = async () => {
      try {
        const response = await axios.get(`/api/interviewers?id=${interviewerId}`);
        if (response.data.success && response.data.interviewer) {
          setImg(response.data.interviewer.avatarUrl || "/default-interviewer.svg");
          setInterviewerName(response.data.interviewer.name);
        }
      } catch (error) {
        console.error("Failed to fetch interviewer:", error);
        setImg("/default-interviewer.svg");
        setInterviewerName("AI Interviewer");
      }
    };
    fetchInterviewer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        // Fetch responses using the new API endpoint
        const response = await axios.get(`/api/analytics?interviewId=${id}`);
        if (response.data.success) {
          const analytics = response.data.analytics;
          setResponseCount(analytics.totalSessions || 0);
        }
      } catch (error) {
        console.error("Failed to fetch responses:", error);
        setResponseCount(0);
      }
    };

    fetchResponses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(
        readableSlug ? `${base_url}/call/${readableSlug}` : (url as string),
      )
      .then(
        () => {
          setCopied(true);
          toast.success(
            "The link to your interview has been copied to your clipboard.",
            {
              position: "bottom-right",
              duration: 3000,
            },
          );
          setTimeout(() => {
            setCopied(false);
          }, 2000);
        },
        (err) => {
          console.log("failed to copy", err.message);
        },
      );
  };

  const handleJumpToInterview = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    const interviewUrl = readableSlug
      ? `/call/${readableSlug}`
      : `/call/${url}`;
    window.open(interviewUrl, "_blank");
  };

  return (
    <a
      href={`/interviews/${id}`}
      style={{
        pointerEvents: isFetching ? "none" : "auto",
        cursor: isFetching ? "default" : "pointer",
      }}
      className="block"
    >
      <Card className="relative group h-80 bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
        <CardContent className={`p-0 h-full ${isFetching ? "opacity-60" : ""}`}>
          {/* Header with gradient background */}
          <div className="relative h-32 bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/10"></div>
            <CardTitle
              className="relative text-white text-xl font-bold text-center px-4 leading-tight line-clamp-2"
              title={name || ""}
            >
              {name}
            </CardTitle>
            {isFetching && (
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                <MiniLoader />
              </div>
            )}

            {/* Action buttons */}
            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                className="h-8 w-8 p-0 bg-white/20 hover:bg-white/30 border-0 backdrop-blur-sm"
                onClick={handleJumpToInterview}
              >
                <ExternalLink className="h-4 w-4 text-white" />
              </Button>
              <Button
                size="sm"
                className={`h-8 w-8 p-0 border-0 backdrop-blur-sm transition-colors ${
                  copied
                    ? "bg-emerald-500 hover:bg-emerald-600"
                    : "bg-white/20 hover:bg-white/30"
                }`}
                onClick={(event) => {
                  event.stopPropagation();
                  event.preventDefault();
                  copyToClipboard();
                }}
              >
                {copied ? <CheckCircle className="h-4 w-4 text-white" /> : <Copy className="h-4 w-4 text-white" />}
              </Button>
            </div>
          </div>

          {/* Content section */}
          <div className="p-6 flex flex-col justify-between h-48">
            {/* Interviewer info */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-violet-200">
                  <Image
                    src={img || "/default-interviewer.png"}
                    alt="Interviewer"
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-sm">{interviewerName}</p>
                <p className="text-xs text-slate-500">AI Interviewer</p>
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-violet-600" />
                  <span className="text-sm text-slate-600">Responses</span>
                </div>
                <span className="font-semibold text-slate-900">
                  {responseCount ?? 0}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm text-slate-600">Success Rate</span>
                </div>
                <span className="font-semibold text-emerald-600">85%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-purple-600" />
                  <span className="text-sm text-slate-600">Created</span>
                </div>
                <span className="font-semibold text-slate-900">Today</span>
              </div>
            </div>

            {/* Status indicator */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-slate-600">Active</span>
              </div>
              <div className="text-xs text-slate-500">
                Click to view details
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </a>
  );
}

export default InterviewCard;
