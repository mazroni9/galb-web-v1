import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { insertCarSchema, Car } from "@shared/schema";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

type CarFormProps = {
  car?: Car;
  onSuccess?: () => void;
};

export default function CarForm({ car, onSuccess }: CarFormProps) {
  const { toast } = useToast();
  const isEditMode = !!car;

  // Form
  const form = useForm<z.infer<typeof insertCarSchema>>({
    resolver: zodResolver(insertCarSchema),
    defaultValues: {
      name: car?.name || "",
      year: car?.year || new Date().getFullYear(),
      speed: car?.speed || "",
      price: car?.price || "",
      description: car?.description || "",
      imageUrl: car?.imageUrl || "",
      tag: car?.tag || "",
    },
  });

  // Create car mutation
  const createCarMutation = useMutation({
    mutationFn: async (data: z.infer<typeof insertCarSchema>) => {
      const res = await apiRequest("POST", "/api/cars", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cars"] });
      toast({
        title: "تمت الإضافة بنجاح",
        description: "تمت إضافة السيارة بنجاح",
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

  // Update car mutation
  const updateCarMutation = useMutation({
    mutationFn: async (data: z.infer<typeof insertCarSchema>) => {
      const res = await apiRequest("PUT", `/api/cars/${car?.id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cars"] });
      toast({
        title: "تم التحديث بنجاح",
        description: "تم تحديث السيارة بنجاح",
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
  const onSubmit = (data: z.infer<typeof insertCarSchema>) => {
    if (isEditMode) {
      updateCarMutation.mutate(data);
    } else {
      createCarMutation.mutate(data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>اسم السيارة</FormLabel>
              <FormControl>
                <Input className="bg-[#0F172A] border-[#334155]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>سنة الإنتاج</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    className="bg-[#0F172A] border-[#334155]" 
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="speed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>السرعة القصوى</FormLabel>
                <FormControl>
                  <Input className="bg-[#0F172A] border-[#334155]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>السعر</FormLabel>
                <FormControl>
                  <Input className="bg-[#0F172A] border-[#334155]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="tag"
            render={({ field }) => (
              <FormItem>
                <FormLabel>التصنيف (اختياري)</FormLabel>
                <FormControl>
                  <Input className="bg-[#0F172A] border-[#334155]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>رابط الصورة</FormLabel>
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
        
        <div className="flex justify-end space-x-2 space-x-reverse">
          <Button
            type="submit"
            className="bg-[#3B82F6] hover:bg-blue-600"
            disabled={createCarMutation.isPending || updateCarMutation.isPending}
          >
            {(createCarMutation.isPending || updateCarMutation.isPending) && (
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            )}
            {isEditMode ? "تحديث السيارة" : "إضافة السيارة"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
