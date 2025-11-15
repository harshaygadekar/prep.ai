"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import React, { useState, useEffect } from "react";
import { useOrganization } from "@clerk/nextjs";
import { useInterviews } from "@/contexts/interviews.context";
import { Share2, Filter, Pencil, UserIcon, Eye, Palette } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import { Interview } from "@/types/interview";
import { Response } from "@/types/response";
import { formatTimestampToDateHHMM } from "@/lib/utils";
import CallInfo from "@/components/call/callInfo";
import SummaryInfo from "@/components/dashboard/interview/summaryInfo";
import EditInterview from "@/components/dashboard/interview/editInterview";
import Modal from "@/components/dashboard/Modal";
import { toast } from "sonner";
import { ChromePicker } from "react-color";
import SharePopup from "@/components/dashboard/interview/sharePopup";
import ResponseService from "@/services/response.service";
import ClientService from "@/services/client.service";
import InterviewService from "@/services/interview.service";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CandidateStatus } from "@/lib/enum";
import LoaderWithText from "@/components/loaders/loader-with-text/loaderWithText";

interface Props {
  params: {
    interviewId: string;
  };
  searchParams: {
    call: string;
    edit: boolean;
  };
}

const base_url = process.env.NEXT_PUBLIC_LIVE_URL;

function InterviewHome({ params, searchParams }: Props) {
  const [interview, setInterview] = useState<Interview>();
  const [responses, setResponses] = useState<Response[]>();
  const { getInterviewById } = useInterviews();
  const [isSharePopupOpen, setIsSharePopupOpen] = useState(false);
  const router = useRouter();
  const [isActive, setIsActive] = useState<boolean>(true);
  const [currentPlan, setCurrentPlan] = useState<string>("");
  const [isGeneratingInsights, setIsGeneratingInsights] =
    useState<boolean>(false);
  const [isViewed, setIsViewed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const [themeColor, setThemeColor] = useState<string>("#4F46E5");
  const [iconColor, seticonColor] = useState<string>("#4F46E5");
  const { organization } = useOrganization();
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  const seeInterviewPreviewPage = () => {
    const protocol = base_url?.includes("localhost") ? "http" : "https";
    if (interview?.urlSlug) {
      const url = interview?.urlSlug
        ? `${protocol}://${base_url}/call/${interview?.urlSlug}`
        : interview.urlSlug.startsWith("http")
          ? interview.urlSlug
          : `https://${interview.urlSlug}`;
      window.open(url, "_blank");
    } else {
      console.error("Interview URL is null or undefined.");
    }
  };

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const response = await getInterviewById(params.interviewId);
        setInterview(response);
        setIsActive(response.isActive);
        setIsViewed(response.isViewed);
        setThemeColor(response.themeColor ?? "#4F46E5");
        seticonColor(response.themeColor ?? "#4F46E5");
        setLoading(true);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (!interview || !isGeneratingInsights) {
      fetchInterview();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getInterviewById, params.interviewId, isGeneratingInsights]);

  useEffect(() => {
    const fetchOrganizationData = async () => {
      try {
        if (organization?.id) {
          const data = await ClientService.getOrganizationById(organization.id);
          if (data?.plan) {
            setCurrentPlan(data.plan);
          }
        }
      } catch (error) {
        console.error("Error fetching organization data:", error);
      }
    };

    fetchOrganizationData();
  }, [organization]);
  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const response = await ResponseService.getAllResponses(
          params.interviewId,
        );
        setResponses(response);
        setLoading(true);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteResponse = (deletedCallId: string) => {
    if (responses) {
      setResponses(
        responses.filter((response) => response.callId !== deletedCallId),
      );
      if (searchParams.call === deletedCallId) {
        router.push(`/interviews/${params.interviewId}`);
      }
    }
  };

  const handleResponseClick = async (response: Response) => {
    try {
      // Mock response update - in production would call API
      if (responses) {
        const updatedResponses = responses.map((r) =>
          r.callId === response.callId ? { ...r, isViewed: true } : r,
        );
        setResponses(updatedResponses);
      }
      setIsViewed(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggle = async () => {
    try {
      const updatedIsActive = !isActive;
      setIsActive(updatedIsActive);

      await InterviewService.updateInterview(
        params.interviewId,
        { isActive: updatedIsActive }
      );

      toast.success("Interview status updated", {
        description: `The interview is now ${
          updatedIsActive ? "active" : "inactive"
        }.`,
        position: "bottom-right",
        duration: 3000,
      });
    } catch (error) {
      console.error(error);
      toast.error("Error", {
        description: "Failed to update the interview status.",
        duration: 3000,
      });
    }
  };

  const handleThemeColorChange = async (newColor: string) => {
    try {
      await InterviewService.updateInterview(
        params.interviewId,
        { themeColor: newColor }
      );

      toast.success("Theme color updated", {
        position: "bottom-right",
        duration: 3000,
      });
    } catch (error) {
      console.error(error);
      toast.error("Error", {
        description: "Failed to update the theme color.",
        duration: 3000,
      });
    }
  };

  const handleCandidateStatusChange = (callId: string, newStatus: string) => {
    setResponses((prevResponses) => {
      return prevResponses?.map((response) =>
        response.callId === callId
          ? { ...response, candidateStatus: newStatus }
          : response,
      );
    });
  };

  const openSharePopup = () => {
    setIsSharePopupOpen(true);
  };

  const closeSharePopup = () => {
    setIsSharePopupOpen(false);
  };

  const handleColorChange = (color: any) => {
    setThemeColor(color.hex);
  };

  const applyColorChange = () => {
    if (themeColor !== iconColor) {
      seticonColor(themeColor);
      handleThemeColorChange(themeColor);
    }
    setShowColorPicker(false);
  };

  const filterResponses = () => {
    if (!responses) {
      return [];
    }
    if (filterStatus == "ALL") {
      return responses;
    }

    return responses?.filter(
      (response) => response?.candidateStatus == filterStatus,
    );
  };

  return (
    <div className="flex flex-col w-full h-full m-2 bg-white">
      {loading ? (
        <div className="flex flex-col items-center justify-center h-[80%] w-full">
          <LoaderWithText />
        </div>
      ) : (
        <>
          {/* Simplified Header - UI-009 Fix */}
          <div className="flex flex-row p-4 pt-6 justify-between items-center sticky top-2 bg-white border-b border-slate-200 shadow-sm">
            {/* Left Side - Title and Meta */}
            <div className="flex items-center gap-4">
              <div
                className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                style={{ backgroundColor: iconColor }}
              />
              <div>
                <div className="font-bold text-lg text-slate-900">{interview?.name}</div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <UserIcon size={14} />
                  <span>{String(responses?.length)} responses</span>
                </div>
              </div>
            </div>

            {/* Right Side - Actions */}
            <div className="flex items-center gap-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9"
                      onClick={(e) => {
                        e.stopPropagation();
                        openSharePopup();
                      }}
                    >
                      <Share2 size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Share</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9"
                      onClick={(e) => {
                        e.stopPropagation();
                        seeInterviewPreviewPage();
                      }}
                    >
                      <Eye size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Preview</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowColorPicker(!showColorPicker);
                      }}
                    >
                      <Palette size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Theme</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9"
                      onClick={() => router.push(`/interviews/${params.interviewId}?edit=true`)}
                    >
                      <Pencil size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Edit</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <div className="h-6 w-px bg-slate-300 mx-2"></div>

              <div className="flex items-center gap-2">
                {currentPlan === "free_trial_over" ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <span className="text-sm text-slate-500">Inactive</span>
                      </TooltipTrigger>
                      <TooltipContent>Upgrade your plan to reactivate</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <>
                    <span className="text-sm text-slate-700">{isActive ? 'Active' : 'Inactive'}</span>
                    <Switch
                      checked={isActive}
                      onCheckedChange={handleToggle}
                      className={isActive ? "bg-indigo-600" : "bg-slate-300"}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-row w-full p-2 h-[85%] gap-1 ">
            <div className="w-[20%] flex flex-col p-2 divide-y-2 rounded-sm border-2 border-slate-100">
              <div className="flex w-full justify-center py-2">
                <Select
                  onValueChange={async (newValue: string) => {
                    setFilterStatus(newValue);
                  }}
                >
                  <SelectTrigger className="w-[95%] bg-slate-100 rounded-lg">
                    <Filter size={18} className=" text-slate-400" />
                    <SelectValue placeholder="Filter By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={CandidateStatus.NO_STATUS}>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-gray-400 rounded-full mr-2" />
                        No Status
                      </div>
                    </SelectItem>
                    <SelectItem value={CandidateStatus.NOT_SELECTED}>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-2" />
                        Not Selected
                      </div>
                    </SelectItem>
                    <SelectItem value={CandidateStatus.POTENTIAL}>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2" />
                        Potential
                      </div>
                    </SelectItem>
                    <SelectItem value={CandidateStatus.SELECTED}>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
                        Selected
                      </div>
                    </SelectItem>
                    <SelectItem value="ALL">
                      <div className="flex items-center">
                        <div className="w-3 h-3 border-2 border-gray-300 rounded-full mr-2" />
                        All
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <ScrollArea className="h-full p-1 rounded-md border-none">
                {filterResponses().length > 0 ? (
                  filterResponses().map((response) => (
                    <div
                      className={`p-2 rounded-md hover:bg-indigo-100 border-2 my-1 text-left text-xs ${
                        searchParams.call == response.callId
                          ? "bg-indigo-200"
                          : "border-indigo-100"
                      } flex flex-row justify-between cursor-pointer w-full`}
                      key={response?.id}
                      onClick={() => {
                        router.push(
                          `/interviews/${params.interviewId}?call=${response.callId}`,
                        );
                        handleResponseClick(response);
                      }}
                    >
                      <div className="flex flex-row gap-1 items-center w-full">
                        {response.candidateStatus === "NOT_SELECTED" ? (
                          <div className="w-[5%] h-full bg-red-500 rounded-sm" />
                        ) : response.candidateStatus === "POTENTIAL" ? (
                          <div className="w-[5%] h-full bg-yellow-500 rounded-sm" />
                        ) : response.candidateStatus === "SELECTED" ? (
                          <div className="w-[5%] h-full bg-green-500 rounded-sm" />
                        ) : (
                          <div className="w-[5%] h-full bg-gray-400 rounded-sm" />
                        )}
                        <div className="flex items-center justify-between w-full">
                          <div className="flex flex-col my-auto">
                            <p className="font-medium mb-[2px]">
                              {response?.name
                                ? `${response?.name}'s Response`
                                : "Anonymous"}
                            </p>
                            <p className="">
                              {formatTimestampToDateHHMM(
                                String(response?.createdAt),
                              )}
                            </p>
                          </div>
                          <div className="flex flex-col items-center justify-center ml-auto flex-shrink-0">
                            {!response.isViewed && (
                              <div className="w-4 h-4 flex items-center justify-center mb-1">
                                <div className="text-indigo-500 text-xl leading-none">
                                  ●
                                </div>
                              </div>
                            )}
                            <div
                              className={`w-6 h-6 flex items-center justify-center ${
                                response.isViewed ? "h-full" : ""
                              }`}
                            >
                              {response.analytics &&
                                response.analytics.overallScore !==
                                  undefined && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div className="w-6 h-6 rounded-full bg-white border-2 border-indigo-500 flex items-center justify-center">
                                          <span className="text-indigo-500 text-xs font-semibold">
                                            {response?.analytics?.overallScore}
                                          </span>
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent
                                        className="bg-gray-500"
                                        side="bottom"
                                        sideOffset={4}
                                      >
                                        <span className="text-white font-normal flex flex-row gap-4">
                                          Overall Score
                                        </span>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">
                    No responses to display
                  </p>
                )}
              </ScrollArea>
            </div>
            {responses && (
              <div className="w-[85%] rounded-md ">
                {searchParams.call ? (
                  <CallInfo
                    call_id={searchParams.call}
                    onDeleteResponse={handleDeleteResponse}
                    onCandidateStatusChange={handleCandidateStatusChange}
                  />
                ) : searchParams.edit ? (
                  <EditInterview interview={interview} />
                ) : (
                  <SummaryInfo responses={responses} interview={interview} />
                )}
              </div>
            )}
          </div>
        </>
      )}
      {/* UI-014 Fix: Improved Color Picker Modal */}
      <Modal
        open={showColorPicker}
        closeOnOutsideClick={false}
        onClose={() => {
          setThemeColor(iconColor);
          setShowColorPicker(false);
        }}
      >
        <div className="w-[280px] p-4">
          <h3 className="text-lg font-semibold mb-4 text-center text-slate-900">
            Choose Theme Color
          </h3>

          {/* Color Presets */}
          <div className="mb-4">
            <p className="text-sm font-medium text-slate-700 mb-2">Presets</p>
            <div className="grid grid-cols-6 gap-2">
              {['#4F46E5', '#7C3AED', '#EC4899', '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#14B8A6', '#F97316', '#06B6D4'].map((color) => (
                <button
                  key={color}
                  className={`w-10 h-10 rounded-lg border-2 transition-all hover:scale-110 ${
                    themeColor === color ? 'border-slate-900 shadow-md' : 'border-slate-200'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setThemeColor(color)}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
          </div>

          {/* Custom Color Picker */}
          <div className="mb-4">
            <p className="text-sm font-medium text-slate-700 mb-2">Custom Color</p>
            <ChromePicker
              disableAlpha={true}
              color={themeColor}
              styles={{
                default: {
                  picker: { width: "100%", boxShadow: "none" },
                },
              }}
              onChange={handleColorChange}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setThemeColor(iconColor);
                setShowColorPicker(false);
              }}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-indigo-600 hover:bg-indigo-700"
              onClick={applyColorChange}
            >
              Apply
            </Button>
          </div>
        </div>
      </Modal>
      {isSharePopupOpen && (
        <SharePopup
          open={isSharePopupOpen}
          shareContent={
            interview?.urlSlug
              ? `${base_url}/call/${interview?.urlSlug}`
              : (interview?.urlSlug as string)
          }
          onClose={closeSharePopup}
        />
      )}
    </div>
  );
}

export default InterviewHome;
