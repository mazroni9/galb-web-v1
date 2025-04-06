import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Video } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LoginData } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { X, SkipForward, ChevronRight, ChevronLeft } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(3, { message: "اسم المستخدم يجب أن يكون 3 أحرف على الأقل" }),
  password: z.string().min(6, { message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" }),
});

type HeroSectionProps = {
  loginOpen: boolean;
  onLoginClose: () => void;
};

export default function HeroSection({ loginOpen, onLoginClose }: HeroSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isAutoplayEnabled, setIsAutoplayEnabled] = useState(true);
  const [progress, setProgress] = useState(0);
  const { user, loginMutation } = useAuth();

  // Get featured videos
  const { data: featuredVideos } = useQuery<Video[]>({
    queryKey: ["/api/videos/featured"],
  });

  // Login form
  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Handle video ended event - play next video
  useEffect(() => {
    const videoElement = videoRef.current;
    
    const handleVideoEnded = () => {
      if (isAutoplayEnabled && featuredVideos && featuredVideos.length > 0) {
        // Move to next video or loop back to the first one
        const nextIndex = (currentVideoIndex + 1) % featuredVideos.length;
        setCurrentVideoIndex(nextIndex);
      }
    };
    
    if (videoElement) {
      videoElement.addEventListener('ended', handleVideoEnded);
      return () => {
        videoElement.removeEventListener('ended', handleVideoEnded);
      };
    }
  }, [currentVideoIndex, featuredVideos, isAutoplayEnabled]);

  // When current video index changes, play the new video
  useEffect(() => {
    if (videoRef.current && !isPaused) {
      videoRef.current.load();
      videoRef.current.play().catch(error => {
        console.error("Video play error:", error);
      });
    }
  }, [currentVideoIndex]);
  
  // Track video progress
  useEffect(() => {
    const videoElement = videoRef.current;
    
    const updateProgress = () => {
      if (videoElement) {
        const progressValue = (videoElement.currentTime / videoElement.duration) * 100;
        setProgress(progressValue);
      }
    };
    
    if (videoElement) {
      videoElement.addEventListener('timeupdate', updateProgress);
      return () => {
        videoElement.removeEventListener('timeupdate', updateProgress);
      };
    }
  }, []);

  // Handle video play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPaused(false);
      } else {
        videoRef.current.pause();
        setIsPaused(true);
      }
    }
  };

  // Handle video mute/unmute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  // Toggle autoplay
  const toggleAutoplay = () => {
    setIsAutoplayEnabled(!isAutoplayEnabled);
  };

  // Go to next video
  const nextVideo = () => {
    if (featuredVideos && featuredVideos.length > 0) {
      const nextIndex = (currentVideoIndex + 1) % featuredVideos.length;
      setCurrentVideoIndex(nextIndex);
    }
  };

  // Go to previous video
  const previousVideo = () => {
    if (featuredVideos && featuredVideos.length > 0) {
      const prevIndex = (currentVideoIndex - 1 + featuredVideos.length) % featuredVideos.length;
      setCurrentVideoIndex(prevIndex);
    }
  };

  // Handle form submission
  const onSubmit = (data: LoginData) => {
    loginMutation.mutate(data);
  };

  // Default video URL if no featured videos
  const defaultVideoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
  const currentVideo = featuredVideos && featuredVideos.length > 0 
    ? featuredVideos[currentVideoIndex] 
    : { 
        title: "سيارات فاخرة 2023", 
        videoUrl: defaultVideoUrl,
        duration: "00:10"
      };

  return (
    <div className="flex flex-col items-center justify-center py-8 relative">
      {/* Login Panel */}
      <div 
        className={`fixed top-20 left-4 bg-[#1E293B] rounded-lg shadow-xl p-4 z-20 w-72 border border-[#334155] transform transition-transform duration-300 ${
          loginOpen ? 'translate-x-0' : '-translate-x-80'
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">تسجيل الدخول</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-400 hover:text-gray-200 h-8 w-8 p-0" 
            onClick={onLoginClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-300">اسم المستخدم</FormLabel>
                  <FormControl>
                    <Input 
                      className="bg-[#0F172A] border-[#334155] text-gray-100"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-300">كلمة المرور</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      className="bg-[#0F172A] border-[#334155] text-gray-100"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full bg-[#3B82F6] hover:bg-blue-600"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "جاري التسجيل..." : "دخول"}
            </Button>
          </form>
        </Form>
        
        <div className="text-center text-sm mt-4">
          <a href="#" className="text-[#3B82F6] hover:text-blue-400 transition">
            نسيت كلمة المرور؟
          </a>
        </div>
      </div>

      <h1 className="text-4xl sm:text-5xl font-bold text-center mb-6">
        <span className="text-[#F59E0B]">قلب</span>{" "}
        <span className="text-[#3B82F6]">للسيارات الفاخرة</span>
      </h1>
      <p className="text-xl text-gray-300 max-w-2xl text-center mb-8">
        تصفح أجمل وأحدث السيارات الفاخرة والرياضية من مختلف أنحاء العالم
      </p>

      {/* Video Player */}
      <div className="relative w-full max-w-4xl rounded-xl overflow-hidden shadow-2xl mb-12 bg-[#1E293B]">
        <div className="relative">
          {/* Video Container */}
          <div className="w-full h-0 pb-[56.25%] relative">
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              muted={isMuted}
              src={currentVideo.videoUrl}
              key={currentVideo.videoUrl} // Force re-render on src change
              onLoadedData={() => {
                if (!isPaused) {
                  videoRef.current?.play().catch(e => console.error("Error auto-playing video:", e));
                }
              }}
            />
            
            {/* Video Controls Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/70 to-transparent opacity-0 hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
              {/* Video Title */}
              <div className="self-end text-sm bg-[#0F172A]/80 px-3 py-1 rounded-full">
                <span>{currentVideo.title}</span>
              </div>
              
              {/* Video Controls */}
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-[#0F172A]/80 hover:bg-[#3B82F6] h-10 w-10 border-none"
                    onClick={togglePlay}
                  >
                    <i className={`fas ${isPaused ? 'fa-play' : 'fa-pause'}`}></i>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-[#0F172A]/80 hover:bg-[#3B82F6] h-10 w-10 border-none"
                    onClick={toggleMute}
                  >
                    <i className={`fas ${isMuted ? 'fa-volume-mute' : 'fa-volume-up'}`}></i>
                  </Button>
                </div>
                
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-[#0F172A]/80 hover:bg-[#3B82F6] h-10 w-10 border-none"
                    onClick={previousVideo}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-[#0F172A]/80 hover:bg-[#3B82F6] h-10 w-10 border-none"
                    onClick={nextVideo}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className={`rounded-full bg-[#0F172A]/80 ${isAutoplayEnabled ? 'text-[#F59E0B]' : ''} hover:bg-[#3B82F6] h-10 w-10 border-none`}
                    onClick={toggleAutoplay}
                    title={isAutoplayEnabled ? "إيقاف التشغيل التلقائي" : "تشغيل تلقائي"}
                  >
                    <SkipForward className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              {/* Video Progress Indicator */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1E293B]">
                <div 
                  className="h-full bg-[#3B82F6] transition-width" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
