import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { insertVideoSchema, Video } from "@shared/schema";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

type VideoFormProps = {
  video?: Video;
  onSuccess?: () => void;
};

export default function VideoForm({ video, onSuccess }: VideoFormProps) {
  const { toast } = useToast();
  const isEditMode = !!video;

  // Form
  const form = useForm<z.infer<typeof insertVideoSchema>>({
    resolver: zodResolver(insertVideoSchema),
    defaultValues: {
      title: video?.title || "",
      description: video?.description || "",
      videoUrl: video?.videoUrl || "",
      thumbnailUrl: video?.thumbnailUrl || "",
      duration: video?.duration || "",
      featured: video?.featured || false,
    },
  });

  // Create video mutation
  const createVideoMutation = useMutation({
    mutationFn: async (data: z.infer<typeof insertVideoSchema>) => {
      const res = await apiRequest("POST", "/api/videos", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
      toast({
        title: "تمت الإضافة بنجاح",
        description: "تمت إضافة الفيديو بنجاح",
      });
      form.reset();
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast({
        title: "فشلت الإضافة",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update video mutation
  const updateVideoMutation = useMutation({
    mutationFn: async (data: z.infer<typeof insertVideoSchema>) => {
      const res = await apiRequest("PUT", `/api/videos/${video?.id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
      toast({
        title: "تم التحديث بنجاح",
        description: "تم تحديث الفيديو بنجاح",
      });
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast({
        title: "فشل التحديث",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Submit form
  const onSubmit = (data: z.infer<typeof insertVideoSchema>) => {
    if (isEditMode) {
      updateVideoMutation.mutate(data);
    } else {
      createVideoMutation.mutate(data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>عنوان الفيديو</FormLabel>
              <FormControl>
                <Input className="bg-[#0F172A] border-[#334155]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الوصف</FormLabel>
              <FormControl>
                <Textarea className="bg-[#0F172A] border-[#334155] min-h-[100px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="videoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>رابط الفيديو</FormLabel>
              <FormControl>
                <Input className="bg-[#0F172A] border-[#334155]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="thumbnailUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>رابط الصورة المصغرة</FormLabel>
              <FormControl>
                <Input className="bg-[#0F172A] border-[#334155]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>مدة الفيديو</FormLabel>
              <FormControl>
                <Input 
                  className="bg-[#0F172A] border-[#334155]" 
                  placeholder="مثال: 04:32" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="featured"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-[#334155] p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">تمييز الفيديو</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 space-x-reverse">
          <Button
            type="submit"
            className="bg-[#3B82F6] hover:bg-blue-600"
            disabled={createVideoMutation.isPending || updateVideoMutation.isPending}
          >
            {(createVideoMutation.isPending || updateVideoMutation.isPending) && (
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            )}
            {isEditMode ? "تحديث الفيديو" : "إضافة الفيديو"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
