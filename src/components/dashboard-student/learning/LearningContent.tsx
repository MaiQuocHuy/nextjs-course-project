"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Play,
  FileText,
  HelpCircle,
  Loader2,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  SkipBack,
  SkipForward,
  Settings,
  AlertTriangle,
  X,
  Eye,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useCompleteLessonMutation,
  useSubmitQuizMutation,
} from "@/services/student/studentApi";
import type {
  QuizSubmissionResponse,
  TransformedLesson,
  TransformedSection,
  LearningQuizQuestion,
} from "@/types/student";
import { useAppDispatch } from "@/store/hook";
import {
  markLessonCompleted,
  updateQuizScore,
} from "@/store/slices/student/learningProgressSlice";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Comments } from "./Comments";
import { toast } from "sonner";

interface LearningContentProps {
  currentLesson?: TransformedLesson;
  section?: TransformedSection;
  courseId: string;
  onMarkComplete?: (lessonId: string) => void;
  onRefetchCourse?: () => void;
}

interface QuizState {
  answers: Record<string, string>;
  submitted: boolean;
  showResults: boolean;
  submissionResult?: QuizSubmissionResponse;
}

const VideoContent = ({
  lesson,
  onAutoComplete,
}: {
  lesson: TransformedLesson;
  onAutoComplete?: () => void;
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSeekWarning, setShowSeekWarning] = useState(false);
  const [maxWatchedTime, setMaxWatchedTime] = useState(0);
  const allowSkipBuffer = 60; // Cho phép tua trước tối đa 60 giây so với điểm đã xem
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const storageKey = `video-progress-${lesson.video?.id}`; // key duy nhất cho mỗi video
  const volumeStorageKey = "video-player-volume"; // key chung cho tất cả video
  const playbackRateStorageKey = "video-player-playback-rate"; // key cho tốc độ phát

  // Load lại tiến trình xem, volume và playback rate
  useEffect(() => {
    const savedTime = localStorage.getItem(storageKey);
    const savedVolume = localStorage.getItem(volumeStorageKey);
    const savedPlaybackRate = localStorage.getItem(playbackRateStorageKey);

    if (savedTime && videoRef.current) {
      const time = parseFloat(savedTime);
      setCurrentTime(time);
      // Set thời gian thực sự của video khi video đã sẵn sàng
      if (videoRef.current.readyState >= 2) {
        videoRef.current.currentTime = time;
      }
    }

    if (savedVolume) {
      const vol = parseFloat(savedVolume);
      setVolume(vol);
      if (videoRef.current) {
        videoRef.current.volume = vol;
      }
    }

    if (savedPlaybackRate) {
      const rate = parseFloat(savedPlaybackRate);
      setPlaybackRate(rate);
      if (videoRef.current) {
        videoRef.current.playbackRate = rate;
      }
    }
  }, [lesson.id, storageKey, volumeStorageKey, playbackRateStorageKey]);

  if (!lesson.video) return null;

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    const { currentTime, duration } = video;

    setCurrentTime(currentTime);
    setDuration(duration);

    if (currentTime > maxWatchedTime) {
      setMaxWatchedTime(currentTime);
    }

    // Lưu vào localStorage mỗi 5 giây để tránh quá nhiều write operations
    if (Math.floor(currentTime) % 5 === 0 || currentTime === 0) {
      localStorage.setItem(storageKey, currentTime.toString());
    }

    // Auto complete when user watches >= 90% of video
    if (
      duration > 0 &&
      currentTime >= duration * 0.9 &&
      !lesson.isCompleted &&
      onAutoComplete
    ) {
      onAutoComplete();
    }
  };

  const handlePlay = () => setIsPlaying(true);

  const handlePause = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    setIsPlaying(false);
    // Lưu tiến trình khi pause
    const video = e.currentTarget;
    localStorage.setItem(storageKey, video.currentTime.toString());
  };

  const handleLoadedData = () => setIsLoaded(true);

  const handleVolumeChange = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    const newVolume = video.volume;
    setVolume(newVolume);
    localStorage.setItem(volumeStorageKey, newVolume.toString());
  };

  // Lưu tiến trình, volume và playback rate khi component unmount
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        localStorage.setItem(
          storageKey,
          videoRef.current.currentTime.toString()
        );
        localStorage.setItem(
          volumeStorageKey,
          videoRef.current.volume.toString()
        );
        localStorage.setItem(
          playbackRateStorageKey,
          videoRef.current.playbackRate.toString()
        );
      }
    };
  }, [storageKey, volumeStorageKey, playbackRateStorageKey]);

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const handleSeek = (seekTime: number) => {
    if (videoRef.current) {
      // Kiểm tra xem có được phép tua trước không
      if (seekTime > maxWatchedTime + allowSkipBuffer) {
        videoRef.current.pause();
        setShowSeekWarning(true);
        return;
      }
      videoRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  };

  const handleVolumeSliderChange = (newVolume: number) => {
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      localStorage.setItem(volumeStorageKey, newVolume.toString());
      if (newVolume === 0) {
        setIsMuted(true);
        videoRef.current.muted = true;
      } else if (isMuted) {
        setIsMuted(false);
        videoRef.current.muted = false;
      }
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
      localStorage.setItem(playbackRateStorageKey, rate.toString());
    }
    setShowSettings(false);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Handle click outside settings to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showSettings &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSettings(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSettings]);

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="space-y-4 sm:space-y-6">
      {showSeekWarning && (
        <div className="absolute inset-0 flex items-center justify-center z-50 animate-in fade-in-0 duration-300">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setShowSeekWarning(false)}
          />

          {/* Beautiful Warning Modal */}
          <Card className="relative bg-card/95 backdrop-blur-xl border-destructive/20 shadow-2xl max-w-md mx-4 animate-in zoom-in-95 duration-300">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSeekWarning(false)}
              className="absolute top-3 right-3 h-8 w-8 rounded-full hover:bg-destructive/10 z-10"
            >
              <X className="h-4 w-4" />
            </Button>

            <CardHeader className="text-center pb-3">
              {/* Warning Icon */}
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mb-4 shadow-lg ring-4 ring-amber-50">
                <div className="relative">
                  <AlertTriangle className="h-15 w-15 text-amber-600" />
                </div>
              </div>

              {/* Title */}
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Video Seek Restriction
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Alert Message */}
              <Alert className="border-amber-200 bg-amber-50/50">
                <Eye className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  <strong>Learning Mode Active:</strong> You're trying to skip
                  ahead to content you haven't watched yet.
                </AlertDescription>
              </Alert>

              {/* Message */}
              <div className="text-center space-y-3">
                <p className="text-muted-foreground leading-relaxed">
                  To ensure effective learning and proper content progression,
                  please continue from where you left off or start from the
                  beginning.
                </p>

                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-full px-3 py-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Watchable content</span>
                  <div className="w-2 h-2 bg-gray-300 rounded-full ml-2" />
                  <span>Locked content</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.currentTime = maxWatchedTime;
                      setCurrentTime(maxWatchedTime);
                    }
                    setShowSeekWarning(false);
                    videoRef.current?.play();
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 group"
                  size="lg"
                >
                  <Play className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                  Continue from {formatTime(maxWatchedTime)}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.currentTime = 0;
                      setCurrentTime(0);
                    }
                    setShowSeekWarning(false);
                    videoRef.current?.play();
                  }}
                  className="w-full border-gray-200 hover:bg-gray-50 group"
                >
                  <SkipBack className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                  Start from Beginning
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => setShowSeekWarning(false)}
                  className="w-full text-muted-foreground hover:text-foreground"
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Video title */}
      <p className="text-lg sm:text-xl lg:text-2xl font-bold">
        Video: {lesson.video.title}
      </p>

      {/* Custom Video Player with Controls */}
      <div
        ref={containerRef}
        className="relative group"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => {
          setShowControls(false);
          setShowSettings(false);
        }}
      >
        {/* Video Player Container */}
        <div className="aspect-video bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden shadow-2xl border border-gray-700/50 relative">
          {/* Loading State */}
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                <span className="text-gray-300 text-sm">Loading video...</span>
              </div>
            </div>
          )}

          {/* Video Element - No Default Controls */}
          <video
            ref={videoRef}
            key={lesson.id}
            controls={false}
            className="w-full h-full object-cover cursor-pointer"
            poster={lesson.video.thumbnail}
            onClick={togglePlay}
            onTimeUpdate={handleTimeUpdate}
            onPlay={handlePlay}
            onPause={handlePause}
            onLoadedData={handleLoadedData}
            onVolumeChange={handleVolumeChange}
            onLoadedMetadata={(e) => {
              const video = e.currentTarget;
              const savedTime = localStorage.getItem(storageKey);
              const savedVolume = localStorage.getItem(volumeStorageKey);
              const savedPlaybackRate = localStorage.getItem(
                playbackRateStorageKey
              );

              if (savedTime) {
                const time = parseFloat(savedTime);
                setCurrentTime(time);
                video.currentTime = time;
              }

              if (savedVolume) {
                const vol = parseFloat(savedVolume);
                setVolume(vol);
                video.volume = vol;
              }

              if (savedPlaybackRate) {
                const rate = parseFloat(savedPlaybackRate);
                setPlaybackRate(rate);
                video.playbackRate = rate;
              }
            }}
            onCanPlay={(e) => {
              const video = e.currentTarget;
              const savedTime = localStorage.getItem(storageKey);
              const savedVolume = localStorage.getItem(volumeStorageKey);
              const savedPlaybackRate = localStorage.getItem(
                playbackRateStorageKey
              );

              if (savedTime && video.currentTime === 0) {
                const time = parseFloat(savedTime);
                video.currentTime = time;
              }

              if (savedVolume) {
                const vol = parseFloat(savedVolume);
                video.volume = vol;
              }

              if (savedPlaybackRate) {
                const rate = parseFloat(savedPlaybackRate);
                video.playbackRate = rate;
              }
            }}
            style={{
              filter: "contrast(1.05) brightness(1.02)",
            }}
          >
            <source src={lesson.video.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Center Play/Pause Button */}
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300",
              isPlaying ? "opacity-0" : "opacity-100"
            )}
          >
            <div className="bg-black/50 backdrop-blur-sm rounded-full p-4">
              <Play className="h-12 w-12 text-white fill-white" />
            </div>
          </div>

          {/* Custom Video Controls */}
          <div
            className={cn(
              "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 transition-opacity duration-300",
              showControls ? "opacity-100" : "opacity-0"
            )}
          >
            {/* Progress Bar */}
            <div className="mb-2">
              <div
                className="w-full h-2 bg-white/20 rounded-full cursor-pointer group/progress"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickPosition = (e.clientX - rect.left) / rect.width;
                  const seekTime = clickPosition * duration;
                  handleSeek(seekTime);
                }}
                style={{
                  background: `
                    linear-gradient(
                      to right,
                      rgba(34,197,94,0.5) 0%,
                      rgba(34,197,94,0.5) ${
                        ((maxWatchedTime + allowSkipBuffer) / duration) * 100
                      }%,
                      rgba(255,255,255,0.2) ${
                        ((maxWatchedTime + allowSkipBuffer) / duration) * 100
                      }%,
                      rgba(255,255,255,0.2) 100%
                    )
                  `,
                }}
              >
                <div
                  className="h-full bg-blue-500 rounded-full relative group-hover/progress:bg-blue-400 transition-colors"
                  style={{ width: `${progressPercentage}%` }}
                >
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>

            {/* Controls Row */}
            <div className="flex items-center justify-between">
              {/* Left Controls */}
              <div className="flex items-center gap-6">
                {/* Play/Pause Button */}
                <button
                  onClick={togglePlay}
                  className="text-white hover:text-blue-400 transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="h-6 w-6" />
                  ) : (
                    <Play className="h-6 w-6 fill-current" />
                  )}
                </button>

                {/* Volume Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleMute}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="h-5 w-5" />
                    ) : (
                      <Volume2 className="h-5 w-5" />
                    )}
                  </button>

                  {/* Volume Slider */}
                  <div className="w-20 h-1 bg-white/20 rounded-full cursor-pointer group/volume">
                    <div
                      className="h-full bg-white rounded-full relative"
                      style={{ width: `${volume * 100}%` }}
                      onClick={(e) => {
                        e.stopPropagation();
                        const rect =
                          e.currentTarget.parentElement!.getBoundingClientRect();
                        const clickPosition =
                          (e.clientX - rect.left) / rect.width;
                        handleVolumeSliderChange(
                          Math.max(0, Math.min(1, clickPosition))
                        );
                      }}
                    >
                      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover/volume:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>

                {/* Time Display */}
                <div className="text-white/90 text-sm font-mono">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>

              {/* Right Controls */}
              <div className="flex items-center gap-6 relative">
                {/* Settings Button */}
                <div className="relative mt-2">
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="text-white/80 hover:text-white transition-colors "
                  >
                    <Settings className="h-5 w-5" />
                  </button>

                  {/* Settings Dropdown */}
                  {showSettings && (
                    <div className="absolute bottom-8 right-0 bg-black/90 backdrop-blur-sm rounded-lg p-3 min-w-[200px] z-20">
                      <div className="text-white text-sm font-medium mb-3">
                        Settings
                      </div>

                      {/* Playback Speed */}
                      <div className="mb-3">
                        <div className="text-white/80 text-xs mb-2">
                          Playback Speed
                        </div>
                        <div className="space-y-1">
                          {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map(
                            (rate) => (
                              <button
                                key={rate}
                                onClick={() => handlePlaybackRateChange(rate)}
                                className={cn(
                                  "w-full text-left px-2 py-1 rounded text-sm transition-colors",
                                  playbackRate === rate
                                    ? "bg-blue-600 text-white"
                                    : "text-white/80 hover:text-white hover:bg-white/10"
                                )}
                              >
                                {rate === 1 ? "Normal" : `${rate}x`}
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Fullscreen Button */}
                <button
                  onClick={toggleFullscreen}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <Maximize className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Completion Badge Overlay */}
          {lesson.isCompleted && (
            <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-lg flex items-center gap-2 z-10">
              <CheckCircle className="h-4 w-4" />
              <span>Completed</span>
            </div>
          )}
        </div>
      </div>

      {/* Video Information Panel */}
      <Card className="border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Play className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                  Video Lesson
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Duration: {Math.floor(lesson.video?.duration || 0)} seconds
                </p>
              </div>
            </div>

            {lesson.isCompleted ? (
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                Watched
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="border-blue-200 text-blue-700"
              >
                {progressPercentage > 0
                  ? `${Math.round(progressPercentage)}% watched`
                  : "Not started"}
              </Badge>
            )}
          </div>

          {/* Progress Bar */}
          {progressPercentage > 0 && !lesson.isCompleted && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-600 mb-2">
                <span>Progress</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const TextContent = ({ lesson }: { lesson: TransformedLesson }) => {
  return (
    <div className="prose prose-sm sm:prose max-w-none">
      <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
        <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
          This is a text lesson. In a real application, you would render the
          actual text content here.
        </p>
        <div className="space-y-3 sm:space-y-4">
          <h4 className="font-semibold text-sm sm:text-base">Key Topics:</h4>
          <ul className="list-disc list-inside space-y-1 sm:space-y-2 text-gray-700 text-sm sm:text-base">
            <li>Understanding the fundamentals</li>
            <li>Best practices and patterns</li>
            <li>Common pitfalls to avoid</li>
            <li>Real-world applications</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const QuizContent = ({
  lesson,
  section,
  courseId,
  onMarkComplete,
  onRefetchCourse,
}: {
  lesson: TransformedLesson;
  section: TransformedSection;
  courseId: string;
  onMarkComplete?: () => void;
  onRefetchCourse?: () => void;
}) => {
  const [quizState, setQuizState] = useState<QuizState>({
    answers: {},
    submitted: false,
    showResults: false,
  });

  const [submitQuiz, { isLoading: isSubmitting }] = useSubmitQuizMutation();
  const dispatch = useAppDispatch();

  if (!lesson.quiz) return null;

  const handleAnswerSelect = (questionId: string, answer: string) => {
    if (quizState.submitted) return;

    setQuizState((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: answer,
      },
    }));
  };

  const handleSubmitQuiz = async () => {
    if (!section?.id || isSubmitting) return;

    try {
      const result = await submitQuiz({
        sectionId: section.id,
        lessonId: lesson.id,
        answers: quizState.answers,
      }).unwrap();

      const isPassed = result.score >= 80;

      setQuizState((prev) => ({
        ...prev,
        submitted: true,
        showResults: true,
        submissionResult: result,
      }));

      // Only mark as completed if score >= 80%
      if (isPassed) {
        // Update Redux state with quiz completion and score
        dispatch(
          markLessonCompleted({
            lessonId: lesson.id,
            sectionId: section.id,
            courseId,
            isCompleted: true,
            completedAt: result.submittedAt,
          })
        );

        dispatch(
          updateQuizScore({
            lessonId: lesson.id,
            score: result.score,
          })
        );

        // Mark lesson as complete after successful quiz submission
        if (onMarkComplete) {
          onMarkComplete();
        }

        // Refresh dashboard data to update activity feed
        if (onRefetchCourse) {
          onRefetchCourse();
        }
      } else {
        // Just update the score without marking as completed
        dispatch(
          updateQuizScore({
            lessonId: lesson.id,
            score: result.score,
          })
        );
      }
    } catch (error) {
      toast.error("There was an error submitting your quiz. Please try again.");
    }
  };

  const handleRetryQuiz = () => {
    setQuizState({
      answers: {},
      submitted: false,
      showResults: false,
    });
  };

  const getScore = () => {
    if (quizState.submissionResult) {
      return quizState.submissionResult.score;
    }

    // Fallback to client-side calculation if no server result
    const totalQuestions = lesson.quiz!.questions.length;
    const correctAnswers = lesson.quiz!.questions.filter(
      (q: LearningQuizQuestion) => quizState.answers[q.id] === q.correctAnswer
    ).length;
    return Math.round((correctAnswers / totalQuestions) * 100);
  };

  const getCorrectAnswersCount = () => {
    if (quizState.submissionResult) {
      return quizState.submissionResult.correctAnswers;
    }

    // Fallback to client-side calculation
    return lesson.quiz!.questions.filter(
      (q: LearningQuizQuestion) => quizState.answers[q.id] === q.correctAnswer
    ).length;
  };

  const allQuestionsAnswered = lesson.quiz.questions.every(
    (q: LearningQuizQuestion) => quizState.answers[q.id]
  );

  const isPassed = quizState.submissionResult
    ? quizState.submissionResult.score >= 80
    : false;

  return (
    <div className="space-y-4 sm:space-y-6">
      {quizState.showResults && (
        <Card
          className={`${
            isPassed
              ? "border-green-200 bg-green-50"
              : "border-red-200 bg-red-50"
          }`}
        >
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center gap-2 mb-2">
              {isPassed ? (
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              ) : (
                <X className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
              )}
              <span
                className={`font-semibold text-sm sm:text-base ${
                  isPassed ? "text-green-800" : "text-red-800"
                }`}
              >
                {isPassed ? "Quiz Passed!" : "Quiz Failed"}
              </span>
            </div>
            <p
              className={`text-sm sm:text-base ${
                isPassed ? "text-green-700" : "text-red-700"
              }`}
            >
              Your score: {getScore()}% ({getCorrectAnswersCount()}/
              {lesson.quiz.questions.length} correct)
            </p>
            {!isPassed && (
              <p className="text-red-600 text-sm sm:text-base mt-2">
                You need at least 80% to pass this quiz. Please try again.
              </p>
            )}
            {quizState.submissionResult?.feedback && (
              <p
                className={`text-sm sm:text-base mt-2 ${
                  isPassed ? "text-green-600" : "text-red-600"
                }`}
              >
                {quizState.submissionResult.feedback}
              </p>
            )}
            {!isPassed && (
              <Button
                onClick={handleRetryQuiz}
                variant="outline"
                className="mt-4 border-red-300 text-red-700 hover:bg-red-50"
              >
                Try Again
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <div className="space-y-4 sm:space-y-6">
        {lesson.quiz.questions.map(
          (question: LearningQuizQuestion, index: number) => (
            <Card key={question.id} className="border-gray-200">
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="text-base sm:text-lg leading-snug">
                  Question {index + 1}: {question.questionText}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 sm:space-y-3">
                  {(() => {
                    // Handle object format: { "A": "Option text", "B": "Option text" }
                    const options = question.options;
                    if (!options) return [];

                    if (
                      typeof options === "object" &&
                      !Array.isArray(options)
                    ) {
                      // Object format like { "A": "Database management", "B": "Building user interfaces" }
                      return Object.entries(options).map(([key, value]) => {
                        const optionLetter = key;
                        const optionText = value as string;
                        const isSelected =
                          quizState.answers[question.id] === optionLetter;
                        const isCorrect =
                          optionLetter === question.correctAnswer;
                        const showResult = quizState.showResults;
                        const showCorrectAnswer = showResult && isPassed; // Only show correct answer if passed
                        const isSelectedCorrect = isSelected && isCorrect; // User selected the correct answer
                        const isSelectedIncorrect = isSelected && !isCorrect; // User selected the wrong answer
                        const shouldHighlightCorrect =
                          showResult &&
                          (isSelectedCorrect ||
                            (showCorrectAnswer && isCorrect));

                        return (
                          <button
                            key={key}
                            onClick={() =>
                              handleAnswerSelect(question.id, optionLetter)
                            }
                            className={cn(
                              "w-full text-left p-2.5 sm:p-3 rounded-lg border-2 transition-colors text-sm sm:text-base",
                              !quizState.submitted && "hover:border-blue-300",
                              isSelected &&
                                !showResult &&
                                "border-blue-500 bg-blue-50",
                              shouldHighlightCorrect &&
                                "border-green-500 bg-green-50",
                              showResult &&
                                isSelectedIncorrect &&
                                "border-red-500 bg-red-50",
                              !showResult && !isSelected && "border-gray-200"
                            )}
                            disabled={quizState.submitted}
                          >
                            <div className="flex items-start gap-2 sm:gap-3">
                              <div
                                className={cn(
                                  "w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center text-xs sm:text-sm font-medium flex-shrink-0 mt-0.5 sm:mt-0",
                                  isSelected &&
                                    !showResult &&
                                    "border-blue-500 bg-blue-500 text-white",
                                  shouldHighlightCorrect &&
                                    "border-green-500 bg-green-500 text-white",
                                  showResult &&
                                    isSelectedIncorrect &&
                                    "border-red-500 bg-red-500 text-white",
                                  !showResult &&
                                    !isSelected &&
                                    "border-gray-300"
                                )}
                              >
                                {optionLetter}
                              </div>
                              <div className="flex-1">
                                <span className="leading-relaxed">
                                  {optionText}
                                </span>
                                {showCorrectAnswer &&
                                  isCorrect &&
                                  !isSelected && (
                                    <div className="mt-1 text-xs text-green-600 font-medium">
                                      ✓ Correct Answer
                                    </div>
                                  )}
                              </div>
                            </div>
                          </button>
                        );
                      });
                    }

                    // Fallback for array format
                    if (Array.isArray(options)) {
                      return options.map((option) => {
                        const optionLetter = option.charAt(0);
                        const optionText = option.substring(3);
                        const isSelected =
                          quizState.answers[question.id] === optionLetter;
                        const isCorrect =
                          optionLetter === question.correctAnswer;
                        const showResult = quizState.showResults;
                        const showCorrectAnswer = showResult && isPassed; // Only show correct answer if passed
                        const isSelectedCorrect = isSelected && isCorrect; // User selected the correct answer
                        const isSelectedIncorrect = isSelected && !isCorrect; // User selected the wrong answer
                        const shouldHighlightCorrect =
                          showResult &&
                          (isSelectedCorrect ||
                            (showCorrectAnswer && isCorrect));

                        return (
                          <button
                            key={option}
                            onClick={() =>
                              handleAnswerSelect(question.id, optionLetter)
                            }
                            className={cn(
                              "w-full text-left p-2.5 sm:p-3 rounded-lg border-2 transition-colors text-sm sm:text-base",
                              !quizState.submitted && "hover:border-blue-300",
                              isSelected &&
                                !showResult &&
                                "border-blue-500 bg-blue-50",
                              shouldHighlightCorrect &&
                                "border-green-500 bg-green-50",
                              showResult &&
                                isSelectedIncorrect &&
                                "border-red-500 bg-red-50",
                              !showResult && !isSelected && "border-gray-200"
                            )}
                            disabled={quizState.submitted}
                          >
                            <div className="flex items-start gap-2 sm:gap-3">
                              <div
                                className={cn(
                                  "w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center text-xs sm:text-sm font-medium flex-shrink-0 mt-0.5 sm:mt-0",
                                  isSelected &&
                                    !showResult &&
                                    "border-blue-500 bg-blue-500 text-white",
                                  shouldHighlightCorrect &&
                                    "border-green-500 bg-green-500 text-white",
                                  showResult &&
                                    isSelectedIncorrect &&
                                    "border-red-500 bg-red-500 text-white",
                                  !showResult &&
                                    !isSelected &&
                                    "border-gray-300"
                                )}
                              >
                                {optionLetter}
                              </div>
                              <div className="flex-1">
                                <span className="leading-relaxed">
                                  {optionText}
                                </span>
                                {showCorrectAnswer &&
                                  isCorrect &&
                                  !isSelected && (
                                    <div className="mt-1 text-xs text-green-600 font-medium">
                                      ✓ Correct Answer
                                    </div>
                                  )}
                              </div>
                            </div>
                          </button>
                        );
                      });
                    }

                    return [];
                  })()}
                </div>

                {quizState.showResults &&
                  question.explanation &&
                  (() => {
                    const userAnswer = quizState.answers[question.id];
                    const isUserCorrect = userAnswer === question.correctAnswer;

                    // Show explanation if:
                    // 1. Quiz passed (show for all questions)
                    // 2. Quiz not passed but user answered correctly
                    const shouldShowExplanation = isPassed || isUserCorrect;

                    return shouldShowExplanation ? (
                      <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h5 className="font-medium text-blue-900 mb-1 sm:mb-2 text-sm sm:text-base">
                          Explanation:
                        </h5>
                        <p className="text-blue-800 text-sm sm:text-base leading-relaxed">
                          {question.explanation}
                        </p>
                      </div>
                    ) : null;
                  })()}
              </CardContent>
            </Card>
          )
        )}
      </div>

      {!quizState.submitted && (
        <Button
          onClick={handleSubmitQuiz}
          disabled={!allQuestionsAnswered || isSubmitting}
          className="w-full h-10 sm:h-11"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm sm:text-base">Submitting...</span>
            </div>
          ) : (
            <span className="text-sm sm:text-base">Submit Quiz</span>
          )}
        </Button>
      )}
    </div>
  );
};

export function LearningContent({
  currentLesson,
  section,
  courseId,
  onMarkComplete,
  onRefetchCourse,
}: LearningContentProps) {
  const [completeLesson, { isLoading: isCompleting }] =
    useCompleteLessonMutation();
  const dispatch = useAppDispatch();

  if (!currentLesson || !section) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <div className="text-center">
          <div className="text-gray-400 mb-2">
            <FileText className="h-8 w-8 sm:h-12 sm:w-12 mx-auto" />
          </div>
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
            Select a lesson to begin
          </h3>
          <p className="text-gray-600 text-sm sm:text-base">
            Choose a lesson from the sidebar to start learning
          </p>
        </div>
      </div>
    );
  }

  const handleMarkComplete = async () => {
    if (!section?.id || isCompleting || currentLesson.isCompleted) return;

    try {
      await completeLesson({
        sectionId: section.id,
        lessonId: currentLesson.id,
        courseId,
      }).unwrap();

      // Update Redux state
      dispatch(
        markLessonCompleted({
          lessonId: currentLesson.id,
          sectionId: section.id,
          courseId,
          isCompleted: true,
          completedAt: new Date().toISOString(),
        })
      );

      // Call parent callback if provided
      if (onMarkComplete) {
        onMarkComplete(currentLesson.id);
      }

      // Refetch course data to update progress and UI
      if (onRefetchCourse) {
        onRefetchCourse();
      }
    } catch (error) {
      toast.error("Failed to mark lesson as complete:");
    }
  };

  const handleAutoComplete = async () => {
    // Same logic as manual complete but for auto-completion
    if (!section?.id || isCompleting || currentLesson.isCompleted) return;

    try {
      await completeLesson({
        sectionId: section.id,
        lessonId: currentLesson.id,
        courseId,
      }).unwrap();

      // Update Redux state
      dispatch(
        markLessonCompleted({
          lessonId: currentLesson.id,
          sectionId: section.id,
          courseId,
          isCompleted: true,
          completedAt: new Date().toISOString(),
        })
      );

      if (onMarkComplete) {
        onMarkComplete(currentLesson.id);
      }

      if (onRefetchCourse) {
        onRefetchCourse();
      }
    } catch (error) {
      toast.error("Failed to auto-complete lesson:");
    }
  };

  const getLessonTypeIcon = () => {
    switch (currentLesson.type) {
      case "VIDEO":
        return <Play className="h-5 w-5" />;
      case "QUIZ":
        return <HelpCircle className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getLessonTypeBadge = () => {
    if (currentLesson.isCompleted) {
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Completed
        </Badge>
      );
    }

    switch (currentLesson.type) {
      case "VIDEO":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Video
          </Badge>
        );
      case "QUIZ":
        return (
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            Quiz
          </Badge>
        );
      default:
        return <Badge variant="secondary">Lesson</Badge>;
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="min-h-full flex flex-col">
        {/* Header - now part of scrollable content */}
        <div className="bg-white border-b border-gray-200 p-3 sm:p-4 lg:p-6">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mb-2">
            <span className="truncate">{section.title}</span>
          </div>
          <div className="flex items-start sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-2 sm:gap-3 min-w-0 flex-1">
              {getLessonTypeIcon()}
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold leading-tight line-clamp-2">
                  {currentLesson.title}
                </h1>
                <div className="mt-1 sm:mt-0 sm:inline-block">
                  {getLessonTypeBadge()}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {currentLesson.isCompleted && (
                <div className="flex items-center gap-1 sm:gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-xs sm:text-sm font-medium hidden sm:inline">
                    Completed
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-3 sm:p-4 lg:p-6">
          {currentLesson.type === "VIDEO" && (
            <VideoContent
              key={currentLesson.id}
              lesson={currentLesson}
              onAutoComplete={handleAutoComplete}
            />
          )}
          {currentLesson.type === "QUIZ" && (
            <QuizContent
              key={currentLesson.id}
              lesson={currentLesson}
              section={section}
              courseId={courseId}
              onMarkComplete={handleAutoComplete}
              onRefetchCourse={onRefetchCourse}
            />
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-3 sm:p-4 lg:p-6 bg-white">
          <Comments
            lesson={currentLesson}
            onMarkComplete={handleMarkComplete}
          />
        </div>
      </div>
    </div>
  );
}
