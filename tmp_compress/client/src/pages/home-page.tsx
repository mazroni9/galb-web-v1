import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import HeroSection from "@/components/hero-section";
import CarCard from "@/components/car-card";
import VideoItem from "@/components/video-item";
import { Car, Video } from "@shared/schema";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const [loginOpen, setLoginOpen] = useState(false);

  const {
    data: cars,
    isLoading: isLoadingCars,
    error: carsError,
  } = useQuery<Car[]>({
    queryKey: ["/api/cars"],
  });

  const {
    data: videos,
    isLoading: isLoadingVideos,
    error: videosError,
  } = useQuery<Video[]>({
    queryKey: ["/api/videos"],
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#0F172A] text-gray-100" dir="rtl">
      <Navbar onLoginToggle={() => setLoginOpen(!loginOpen)} loginOpen={loginOpen} />
      
      <main className="container mx-auto px-4 py-6 flex-grow">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left side login panel */}
          <div className={`lg:w-1/4 bg-[#1E293B] rounded-xl p-6 h-fit sticky top-4 mb-6 lg:mb-0 border border-[#334155] shadow-lg ${!loginOpen ? 'hidden lg:block' : ''}`}>
            <h3 className="text-xl font-bold mb-4 text-center">تسجيل الدخول</h3>
            
            <form className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">اسم المستخدم</label>
                <input 
                  type="text" 
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-md py-2 px-3 text-gray-100 focus:ring-[#3B82F6] focus:border-[#3B82F6] outline-none"
                  placeholder="أدخل اسم المستخدم"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">كلمة المرور</label>
                <input 
                  type="password" 
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-md py-2 px-3 text-gray-100 focus:ring-[#3B82F6] focus:border-[#3B82F6] outline-none"
                  placeholder="أدخل كلمة المرور"
                />
              </div>
              
              <button type="button" className="w-full bg-[#3B82F6] hover:bg-blue-600 text-white font-medium py-2 rounded-md transition-colors">
                دخول
              </button>
            </form>
            
            <div className="mt-4 text-center text-sm">
              <a href="#" className="text-[#3B82F6] hover:text-blue-400 transition">
                نسيت كلمة المرور؟
              </a>
            </div>
          </div>
          
          {/* Main content */}
          <div className="lg:w-3/4">
            <HeroSection loginOpen={loginOpen} onLoginClose={() => setLoginOpen(false)} />
            
            {/* Cars section */}
            <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  <span className="text-[#F59E0B] ml-2">
                    <i className="fas fa-car"></i>
                  </span>
                  أحدث السيارات
                </h2>
                <button className="text-[#3B82F6] hover:text-blue-400 flex items-center">
                  عرض الكل
                  <i className="fas fa-chevron-left mr-2"></i>
                </button>
              </div>

              {isLoadingCars ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : carsError ? (
                <div className="text-center py-8 text-red-500">
                  حدث خطأ أثناء تحميل السيارات
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cars?.map((car) => (
                    <CarCard key={car.id} car={car} />
                  ))}
                </div>
              )}
            </div>

            {/* Videos section */}
            <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  <span className="text-[#F59E0B] ml-2">
                    <i className="fas fa-video"></i>
                  </span>
                  فيديوهات السيارات
                </h2>
                <button className="text-[#3B82F6] hover:text-blue-400 flex items-center">
                  المزيد
                  <i className="fas fa-chevron-left mr-2"></i>
                </button>
              </div>

              {isLoadingVideos ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : videosError ? (
                <div className="text-center py-8 text-red-500">
                  حدث خطأ أثناء تحميل الفيديوهات
                </div>
              ) : (
                <div className="relative">
                  <div className="flex overflow-x-auto pb-4 scrollbar-hide gap-4 snap-x snap-mandatory">
                    {videos?.map((video) => (
                      <VideoItem key={video.id} video={video} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
