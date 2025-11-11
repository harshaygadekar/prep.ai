"use client";

import React, { useState, useEffect, useRef } from "react";
import { Interview } from "@/types/interview";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Phone, 
  PhoneOff,
  MessageSquare,
  Clock,
  User,
  Send,
  Volume2,
  VolumeX,
  Settings,
  RotateCcw
} from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

interface CallProps {
  interview: Interview;
}

interface Message {
  id: string;
  type: 'interviewer' | 'candidate';
  content: string;
  timestamp: Date;
}

function Call({ interview }: CallProps) {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userResponse, setUserResponse] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [sessionDuration, setSessionDuration] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const sessionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Mock questions for demo
  const questions = [
    "Tell me about yourself and your background.",
    "What interests you most about this role?",
    "Describe a challenging project you've worked on.",
    "How do you handle working under pressure?",
    "Where do you see yourself in 5 years?"
  ];

  useEffect(() => {
    if (isCallActive && sessionStartTime) {
      sessionIntervalRef.current = setInterval(() => {
        setSessionDuration(Math.floor((Date.now() - sessionStartTime.getTime()) / 1000));
      }, 1000);
    } else {
      if (sessionIntervalRef.current) {
        clearInterval(sessionIntervalRef.current);
      }
    }

    return () => {
      if (sessionIntervalRef.current) {
        clearInterval(sessionIntervalRef.current);
      }
    };
  }, [isCallActive, sessionStartTime]);

  useEffect(() => {
    if (isRecording) {
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      setRecordingTime(0);
    }

    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, [isRecording]);

  const startCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setIsCallActive(true);
      setSessionStartTime(new Date());
      setIsMicOn(true);
      setIsVideoOn(true);
      
      // Add welcome message
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        type: 'interviewer',
        content: `Welcome to your interview session! I'm excited to get to know you better. Let's start with our first question: ${questions[0]}`,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
      
      toast.success("Interview session started!");
    } catch (error) {
      console.error("Error accessing media devices:", error);
      toast.error("Could not access camera/microphone. Please check permissions.");
    }
  };

  const endCall = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    
    setIsCallActive(false);
    setIsMicOn(false);
    setIsVideoOn(false);
    setIsRecording(false);
    setSessionStartTime(null);
    setSessionDuration(0);
    
    toast.success("Interview session ended. Thank you for participating!");
  };

  const toggleMic = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isMicOn;
        setIsMicOn(!isMicOn);
      }
    }
  };

  const toggleVideo = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoOn;
        setIsVideoOn(!isVideoOn);
      }
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    toast.info("Recording started for this question");
  };

  const stopRecording = () => {
    setIsRecording(false);
    toast.success("Recording stopped and saved");
  };

  const submitResponse = async () => {
    if (!userResponse.trim()) {
      toast.error("Please provide a response before submitting");
      return;
    }

    const responseMessage: Message = {
      id: Date.now().toString(),
      type: 'candidate',
      content: userResponse,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, responseMessage]);
    
    // Submit to API for analysis
    try {
      const response = await fetch('/api/interview-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit_response',
          responseData: {
            sessionId: 'current_session', // You would get this from session state
            questionIndex: currentQuestion,
            question: questions[currentQuestion],
            answer: userResponse
          }
        })
      });

      const result = await response.json();
      
      if (result.success) {
        // Show AI feedback
        const feedbackMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'interviewer',
          content: `Thank you for your response! Score: ${result.response.score}/10. ${result.response.feedback}`,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, feedbackMessage]);
        toast.success(`Response analyzed! Score: ${result.response.score}/10`);
      }
    } catch (error) {
      console.error('Error submitting response:', error);
      toast.error('Failed to analyze response');
    }

    setUserResponse("");

    // Move to next question
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        const nextQuestion = currentQuestion + 1;
        setCurrentQuestion(nextQuestion);
        
        const nextQuestionMessage: Message = {
          id: (Date.now() + 2).toString(),
          type: 'interviewer',
          content: `Let's move on to the next question: ${questions[nextQuestion]}`,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, nextQuestionMessage]);
      }, 2000);
    } else {
      setTimeout(() => {
        const endMessage: Message = {
          id: (Date.now() + 2).toString(),
          type: 'interviewer',
          content: "Thank you for completing all the questions! This concludes our interview session. You'll receive detailed feedback shortly.",
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, endMessage]);
      }, 2000);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isCallActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
        <Card className="max-w-2xl w-full p-8 bg-white/10 backdrop-blur-lg border-white/20">
          <CardContent className="text-center space-y-6">
            <div className="p-6 bg-indigo-100 rounded-full w-fit mx-auto">
              <Video className="h-12 w-12 text-indigo-600" />
            </div>
            
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {interview.name}
              </h1>
              <p className="text-blue-100 text-lg">
                {interview.description}
              </p>
            </div>

            <div className="bg-white/10 rounded-lg p-4 text-left">
              <h3 className="text-white font-semibold mb-2">Interview Details:</h3>
              <ul className="text-blue-100 space-y-1 text-sm">
                <li>• Duration: Approximately 15-20 minutes</li>
                <li>• Questions: {questions.length} behavioral and technical questions</li>
                <li>• Format: Video interview with AI interviewer</li>
                <li>• Recording: Your responses will be recorded for evaluation</li>
              </ul>
            </div>

            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
              <p className="text-yellow-100 text-sm">
                <strong>Before starting:</strong> Please ensure your camera and microphone are working properly. 
                You'll need to grant permissions when prompted.
              </p>
            </div>

            <Button
              onClick={startCall}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Video className="h-5 w-5 mr-2" />
              Start Interview
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 h-screen">
        
        {/* Video Section */}
        <div className="lg:col-span-2 space-y-4">
          {/* Header */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-white">
                  <Clock className="h-4 w-4" />
                  <span className="font-mono">{formatTime(sessionDuration)}</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <User className="h-4 w-4" />
                  <span>Question {currentQuestion + 1} of {questions.length}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm font-medium">Live</span>
              </div>
            </div>
          </div>

          {/* Video Feed */}
          <Card className="bg-black/50 backdrop-blur-lg border-white/20 overflow-hidden">
            <CardContent className="p-0 relative aspect-video">
              <video
                ref={videoRef}
                autoPlay
                muted
                className="w-full h-full object-cover"
              />
              {!isVideoOn && (
                <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                  <div className="text-center text-white">
                    <VideoOff className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm opacity-75">Camera is off</p>
                  </div>
                </div>
              )}
              
              {/* Recording Indicator */}
              {isRecording && (
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">REC {formatTime(recordingTime)}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Controls */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={toggleMic}
                variant={isMicOn ? "default" : "destructive"}
                size="lg"
                className="rounded-full w-12 h-12 p-0"
              >
                {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </Button>
              
              <Button
                onClick={toggleVideo}
                variant={isVideoOn ? "default" : "destructive"}
                size="lg"
                className="rounded-full w-12 h-12 p-0"
              >
                {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </Button>
              
              <Button
                onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                variant={isSpeakerOn ? "default" : "secondary"}
                size="lg"
                className="rounded-full w-12 h-12 p-0"
              >
                {isSpeakerOn ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
              </Button>
              
              <Button
                onClick={isRecording ? stopRecording : startRecording}
                variant={isRecording ? "destructive" : "secondary"}
                size="lg"
                className="px-6"
              >
                {isRecording ? (
                  <>
                    <PhoneOff className="h-4 w-4 mr-2" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Phone className="h-4 w-4 mr-2" />
                    Start Recording
                  </>
                )}
              </Button>
              
              <Button
                onClick={endCall}
                variant="destructive"
                size="lg"
                className="px-6"
              >
                <PhoneOff className="h-4 w-4 mr-2" />
                End Interview
              </Button>
            </div>
          </div>
        </div>

        {/* Chat Section */}
        <div className="space-y-4">
          {/* Messages */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 h-96">
            <CardContent className="p-4 h-full flex flex-col">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/20">
                <MessageSquare className="h-5 w-5 text-white" />
                <span className="text-white font-medium">Interview Chat</span>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-3 rounded-lg ${
                      message.type === 'interviewer'
                        ? 'bg-blue-600/30 border-l-4 border-blue-400'
                        : 'bg-green-600/30 border-l-4 border-green-400'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-white/80">
                        {message.type === 'interviewer' ? 'AI Interviewer' : 'You'}
                      </span>
                      <span className="text-xs text-white/60">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-white text-sm">{message.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Response Input */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-4 space-y-4">
              <div>
                <label className="text-white text-sm font-medium mb-2 block">
                  Your Response:
                </label>
                <Textarea
                  value={userResponse}
                  onChange={(e) => setUserResponse(e.target.value)}
                  placeholder="Type your response here..."
                  className="bg-white/10 border-white/20 text-white placeholder-white/50 resize-none"
                  rows={4}
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={submitResponse}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                  disabled={!userResponse.trim()}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Submit Response
                </Button>
                <Button
                  onClick={() => setUserResponse("")}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Call;