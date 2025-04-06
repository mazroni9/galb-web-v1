import { Video } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { arSA } from "date-fns/locale";

type VideoItemProps = {
  video: Video;
  onClick?: () => void;
};

export default function VideoItem({ video, onClick }: VideoItemProps) {
  // تحديد ما إذا كنا في بيئة الإنتاج أم لا
  const isProduction = import.meta.env.PROD;
  // عنوان CDN للصور والفيديوهات في بيئة الإنتاج
  const cdn = isProduction ? 'https://app.qalb9.com' : '';
  
  // الحصول على عنوان URL كامل للوسائط
  const getMediaUrl = (url: string) => {
    if (!url) return '';
    // إذا كان الرابط يبدأ بـ http، فهذا يعني أنه رابط خارجي ويجب استخدامه كما هو
    if (url.startsWith('http')) {
      return url;
    }
    // وإلا، نفترض أنه رابط محلي ونضيف CDN قبله
    return `${cdn}${url}`;
  };

  // Format date (e.g., "منذ 3 أيام")
  const formatUploadDate = (date: Date) => {
    try {
      return formatDistanceToNow(new Date(date), {
        addSuffix: true,
        locale: arSA,
      });
    } catch (error) {
      return "مؤخراً";
    }
  };

  return (
    <div 
      className="min-w-[280px] md:min-w-[320px] snap-start bg-[#1E293B] rounded-lg overflow-hidden group cursor-pointer"
      onClick={onClick}
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={getMediaUrl(video.thumbnailUrl)}
          alt={video.title}
          className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-[#0F172A]/60 rounded-full p-4 transform group-hover:scale-110 transition">
            <i className="fas fa-play text-white text-xl"></i>
          </div>
        </div>
        <div className="absolute bottom-2 right-2 bg-[#0F172A]/80 px-2 py-1 rounded text-xs">
          {video.duration}
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-bold text-base line-clamp-2">{video.title}</h3>
        <p className="text-gray-400 text-xs mt-1">
          {video.uploadDate ? formatUploadDate(video.uploadDate) : ""}
        </p>
      </div>
    </div>
  );
}
