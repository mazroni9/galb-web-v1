import { Car } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type CarCardProps = {
  car: Car;
};

export default function CarCard({ car }: CarCardProps) {
  // تحديد ما إذا كنا في بيئة الإنتاج أم لا
  const isProduction = import.meta.env.PROD;
  // عنوان CDN للصور في بيئة الإنتاج
  const cdn = isProduction ? 'https://app.qalb9.com' : '';
  
  // الحصول على عنوان URL كامل للصور
  const getImageUrl = (url: string) => {
    if (!url) return '';
    // إذا كان الرابط يبدأ بـ http، فهذا يعني أنه رابط خارجي ويجب استخدامه كما هو
    if (url.startsWith('http')) {
      return url;
    }
    // وإلا، نفترض أنه رابط محلي ونضيف CDN قبله
    return `${cdn}${url}`;
  };
  return (
    <div className="bg-[#1E293B] rounded-lg overflow-hidden shadow-lg group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-[#334155]">
      <div className="relative h-48 overflow-hidden">
        <img
          src={getImageUrl(car.imageUrl)}
          alt={car.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {car.tag && (
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 to-transparent flex items-end justify-end p-3">
            <Badge className={car.tag === "هجين" ? "bg-[#10B981]" : "bg-[#F59E0B]"}>
              {car.tag}
            </Badge>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1">{car.name}</h3>
        <div className="flex items-center text-sm text-gray-300 mb-3">
          <i className="fas fa-calendar-alt text-[#3B82F6] ml-1"></i>
          <span>{car.year}</span>
          <span className="mx-2">|</span>
          <i className="fas fa-tachometer-alt text-[#3B82F6] ml-1"></i>
          <span>{car.speed}</span>
        </div>
        <p className="text-gray-400 text-sm mb-4">{car.description}</p>
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg text-[#F59E0B]">{car.price}</span>
          <Button variant="default" size="sm" className="rounded-full bg-[#3B82F6] hover:bg-blue-600">
            تفاصيل أكثر
          </Button>
        </div>
      </div>
    </div>
  );
}
