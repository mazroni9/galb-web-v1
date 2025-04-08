import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { queryClient } from "@/lib/queryClient";
import { Car, Video } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CarForm from "@/components/car-form";
import VideoForm from "@/components/video-form";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PenSquare, Trash2, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function AdminPage() {
  const { toast } = useToast();
  const { user, logoutMutation } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("cars");
  const [editCar, setEditCar] = useState<Car | null>(null);
  const [editVideo, setEditVideo] = useState<Video | null>(null);
  const [isAddCarOpen, setIsAddCarOpen] = useState(false);
  const [isEditCarOpen, setIsEditCarOpen] = useState(false);
  const [isAddVideoOpen, setIsAddVideoOpen] = useState(false);
  const [isEditVideoOpen, setIsEditVideoOpen] = useState(false);

  // Get cars and videos
  const { data: cars, isLoading: isLoadingCars } = useQuery<Car[]>({
    queryKey: ["/api/cars"],
  });

  const { data: videos, isLoading: isLoadingVideos } = useQuery<Video[]>({
    queryKey: ["/api/videos"],
  });

  // Delete car mutation
  const deleteCarMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/cars/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cars"] });
      toast({
        title: "تم الحذف بنجاح",
        description: "تم حذف السيارة بنجاح",
      });
    },
    onError: (error) => {
      toast({
        title: "فشل الحذف",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete video mutation
  const deleteVideoMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/videos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
      toast({
        title: "تم الحذف بنجاح",
        description: "تم حذف الفيديو بنجاح",
      });
    },
    onError: (error) => {
      toast({
        title: "فشل الحذف",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Feature video mutation
  const featureVideoMutation = useMutation({
    mutationFn: async ({ id, featured }: { id: number; featured: boolean }) => {
      await apiRequest("PATCH", `/api/videos/${id}/featured`, { featured });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
      toast({
        title: "تم التحديث بنجاح",
        description: "تم تحديث حالة الفيديو",
      });
    },
    onError: (error) => {
      toast({
        title: "فشل التحديث",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle car edit
  const handleEditCar = (car: Car) => {
    setEditCar(car);
    setIsEditCarOpen(true);
  };

  // Handle video edit
  const handleEditVideo = (video: Video) => {
    setEditVideo(video);
    setIsEditVideoOpen(true);
  };

  // Handle car delete
  const handleDeleteCar = (id: number) => {
    if (window.confirm("هل أنت متأكد من حذف هذه السيارة؟")) {
      deleteCarMutation.mutate(id);
    }
  };

  // Handle video delete
  const handleDeleteVideo = (id: number) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الفيديو؟")) {
      deleteVideoMutation.mutate(id);
    }
  };

  // Handle video featuring
  const handleFeatureVideo = (id: number, featured: boolean) => {
    featureVideoMutation.mutate({ id, featured });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0F172A] text-gray-100" dir="rtl">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6 flex-grow">
        <Card className="bg-[#1E293B] border-[#334155] mb-6">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">
                <span className="text-[#F59E0B]">لوحة</span>{" "}
                <span className="text-[#3B82F6]">التحكم</span>
              </h1>
              <div className="flex items-center gap-4">
                <p className="text-gray-300">
                  مرحباً بك، <span className="font-bold">{user?.username}</span>
                </p>
                <Button onClick={() => logoutMutation.mutate()} variant="outline" size="sm">
                  تسجيل الخروج
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
            <TabsTrigger value="cars">إدارة السيارات</TabsTrigger>
            <TabsTrigger value="videos">إدارة الفيديوهات</TabsTrigger>
          </TabsList>
          
          {/* Cars Tab */}
          <TabsContent value="cars">
            <Card className="bg-[#1E293B] border-[#334155]">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">السيارات</h2>
                  <Dialog open={isAddCarOpen} onOpenChange={setIsAddCarOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-[#10B981] hover:bg-green-600">
                        <Plus className="ml-2 h-4 w-4" />
                        إضافة سيارة جديدة
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#1E293B] border-[#334155] text-white">
                      <DialogHeader>
                        <DialogTitle>إضافة سيارة جديدة</DialogTitle>
                      </DialogHeader>
                      <CarForm onSuccess={() => setIsAddCarOpen(false)} />
                    </DialogContent>
                  </Dialog>
                </div>
                
                {isLoadingCars ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-[#3B82F6]" />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-right text-gray-400 border-b border-[#334155]">
                          <th className="pb-2 font-medium">الاسم</th>
                          <th className="pb-2 font-medium">السنة</th>
                          <th className="pb-2 font-medium">السعر</th>
                          <th className="pb-2 font-medium">الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cars?.map((car) => (
                          <tr key={car.id} className="border-b border-[#334155]">
                            <td className="py-3 pr-2">{car.name}</td>
                            <td className="py-3">{car.year}</td>
                            <td className="py-3">{car.price}</td>
                            <td className="py-3 text-left">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditCar(car)}
                                className="text-[#3B82F6] hover:text-blue-400 hover:bg-transparent"
                              >
                                <PenSquare className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteCar(car.id)}
                                className="text-red-500 hover:text-red-400 hover:bg-transparent"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Edit Car Dialog */}
            <Dialog open={isEditCarOpen} onOpenChange={setIsEditCarOpen}>
              <DialogContent className="bg-[#1E293B] border-[#334155] text-white">
                <DialogHeader>
                  <DialogTitle>تعديل السيارة</DialogTitle>
                </DialogHeader>
                {editCar && (
                  <CarForm 
                    car={editCar} 
                    onSuccess={() => {
                      setIsEditCarOpen(false);
                      setEditCar(null);
                    }} 
                  />
                )}
              </DialogContent>
            </Dialog>
          </TabsContent>
          
          {/* Videos Tab */}
          <TabsContent value="videos">
            <Card className="bg-[#1E293B] border-[#334155]">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">الفيديوهات</h2>
                  <Dialog open={isAddVideoOpen} onOpenChange={setIsAddVideoOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-[#10B981] hover:bg-green-600">
                        <Plus className="ml-2 h-4 w-4" />
                        إضافة فيديو جديد
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#1E293B] border-[#334155] text-white">
                      <DialogHeader>
                        <DialogTitle>إضافة فيديو جديد</DialogTitle>
                      </DialogHeader>
                      <VideoForm onSuccess={() => setIsAddVideoOpen(false)} />
                    </DialogContent>
                  </Dialog>
                </div>
                
                {isLoadingVideos ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-[#3B82F6]" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {videos?.map((video) => (
                      <Card key={video.id} className="bg-[#0F172A] border-[#334155] overflow-hidden">
                        <div className="relative h-44">
                          <img
                            src={video.thumbnailUrl}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-2 right-2 bg-[#0F172A]/80 px-2 py-1 rounded text-xs">
                            {video.duration}
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="space-x-2 space-x-reverse">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditVideo(video)}
                                className="bg-[#1E293B]/80 hover:bg-[#1E293B]"
                              >
                                <PenSquare className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteVideo(video.id)}
                                className="bg-[#1E293B]/80 hover:bg-[#1E293B] text-red-500 hover:text-red-400"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="p-3">
                          <h3 className="font-bold text-base line-clamp-2">{video.title}</h3>
                          <div className="flex justify-between items-center mt-2">
                            <p className="text-gray-400 text-xs">
                              {new Date(video.uploadDate).toLocaleDateString('ar-AE')}
                            </p>
                            <Button
                              variant={video.featured ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleFeatureVideo(video.id, !video.featured)}
                              className={video.featured ? "bg-[#F59E0B] hover:bg-amber-600" : ""}
                            >
                              {video.featured ? "مميز" : "تمييز"}
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Edit Video Dialog */}
            <Dialog open={isEditVideoOpen} onOpenChange={setIsEditVideoOpen}>
              <DialogContent className="bg-[#1E293B] border-[#334155] text-white">
                <DialogHeader>
                  <DialogTitle>تعديل الفيديو</DialogTitle>
                </DialogHeader>
                {editVideo && (
                  <VideoForm 
                    video={editVideo} 
                    onSuccess={() => {
                      setIsEditVideoOpen(false);
                      setEditVideo(null);
                    }} 
                  />
                )}
              </DialogContent>
            </Dialog>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
}
