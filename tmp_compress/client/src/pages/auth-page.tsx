import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertUserSchema, LoginData } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

// Login validation schema
const loginSchema = z.object({
  username: z.string().min(3, { message: "اسم المستخدم يجب أن يكون 3 أحرف على الأقل" }),
  password: z.string().min(6, { message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" }),
});

// Registration validation schema (extends the user schema)
const registerSchema = insertUserSchema.extend({
  password: z.string().min(6, { message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "كلمتا المرور غير متطابقتين",
  path: ["confirmPassword"],
});

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>("login");
  const { user, loginMutation, registerMutation } = useAuth();
  const [location, navigate] = useLocation();
  const { toast } = useToast();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  }, [user, navigate]);

  // Login form
  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      isAdmin: false,
    },
  });

  // Submit login form
  const onLoginSubmit = (data: LoginData) => {
    loginMutation.mutate(data);
  };

  // Submit register form
  const onRegisterSubmit = (data: z.infer<typeof registerSchema>) => {
    const { confirmPassword, ...userData } = data;
    registerMutation.mutate(userData);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0F172A] text-gray-100" dir="rtl">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl">
          {/* Auth Forms */}
          <Card className="bg-[#1E293B] border-[#334155]">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                <span className="text-[#F59E0B]">قلب</span>{" "}
                <span className="text-[#3B82F6]">للسيارات الفاخرة</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger value="login">تسجيل الدخول</TabsTrigger>
                  <TabsTrigger value="register">إنشاء حساب</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>اسم المستخدم</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="أدخل اسم المستخدم" 
                                className="bg-[#0F172A] border-[#334155]" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>كلمة المرور</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="أدخل كلمة المرور" 
                                className="bg-[#0F172A] border-[#334155]" 
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
                        {loginMutation.isPending ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
                
                <TabsContent value="register">
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>اسم المستخدم</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="أدخل اسم المستخدم" 
                                className="bg-[#0F172A] border-[#334155]" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>كلمة المرور</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="أدخل كلمة المرور" 
                                className="bg-[#0F172A] border-[#334155]" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>تأكيد كلمة المرور</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="أكد كلمة المرور" 
                                className="bg-[#0F172A] border-[#334155]" 
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
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          {/* Hero Section */}
          <div className="hidden lg:flex flex-col justify-center p-8 bg-gradient-to-br from-[#1E293B] to-[#0F172A] rounded-lg border border-[#334155]">
            <h2 className="text-4xl font-bold mb-6">
              <span className="text-[#F59E0B]">قلب</span>{" "}
              <span className="text-[#3B82F6]">للسيارات الفاخرة</span>
            </h2>
            <p className="text-lg text-gray-300 mb-6">
              تصفح أجمل وأحدث السيارات الفاخرة والرياضية من مختلف أنحاء العالم
            </p>
            <ul className="space-y-4">
              <li className="flex items-center">
                <span className="bg-[#3B82F6]/20 text-[#3B82F6] p-2 rounded-full mr-3">
                  <i className="fas fa-video"></i>
                </span>
                <span>مقاطع فيديو حصرية لأحدث السيارات</span>
              </li>
              <li className="flex items-center">
                <span className="bg-[#3B82F6]/20 text-[#3B82F6] p-2 rounded-full mr-3">
                  <i className="fas fa-car"></i>
                </span>
                <span>معلومات تفصيلية عن السيارات الفاخرة</span>
              </li>
              <li className="flex items-center">
                <span className="bg-[#3B82F6]/20 text-[#3B82F6] p-2 rounded-full mr-3">
                  <i className="fas fa-tachometer-alt"></i>
                </span>
                <span>تجارب قيادة واختبارات الأداء</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
