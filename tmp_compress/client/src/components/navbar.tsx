import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Menu, UserCircle } from "lucide-react";

type NavbarProps = {
  onLoginToggle?: () => void;
  loginOpen?: boolean;
};

export default function Navbar({ onLoginToggle, loginOpen }: NavbarProps) {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location === path;

  return (
    <nav className="bg-[#1E293B] border-b border-[#334155] py-3 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4 space-x-reverse">
          <Link href="/">
            <a className="text-2xl font-bold">
              <span className="text-[#F59E0B]">قلب</span>{" "}
              <span className="text-[#3B82F6]">Galb</span>
            </a>
          </Link>
          
          <div className="hidden md:flex space-x-4 space-x-reverse">
            <Link href="/">
              <a className={`px-3 py-2 rounded hover:bg-[#334155] transition ${isActive('/') ? 'bg-[#334155]' : ''}`}>
                الرئيسية
              </a>
            </Link>
            <a href="#cars" className="px-3 py-2 rounded hover:bg-[#334155] transition">
              السيارات
            </a>
            <a href="#videos" className="px-3 py-2 rounded hover:bg-[#334155] transition">
              الفيديوهات
            </a>
            <a href="#about" className="px-3 py-2 rounded hover:bg-[#334155] transition">
              عن المشروع
            </a>
          </div>
        </div>

        <div className="flex items-center space-x-2 space-x-reverse">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center">
                  <UserCircle className="ml-2 h-4 w-4" />
                  <span className="hidden sm:inline">{user.username}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#1E293B] border-[#334155] text-white">
                {user.isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">
                      <a className="cursor-pointer flex items-center">
                        <i className="fas fa-user-shield ml-2"></i>
                        لوحة التحكم
                      </a>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => logoutMutation.mutate()} className="cursor-pointer">
                  <i className="fas fa-sign-out-alt ml-2"></i>
                  تسجيل الخروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button 
                variant="outline" 
                onClick={onLoginToggle}
                className={loginOpen ? "bg-[#3B82F6] text-white border-[#3B82F6]" : ""}
              >
                <i className="fas fa-user ml-2"></i>
                تسجيل الدخول
              </Button>
              <Link href="/auth">
                <Button className="hidden sm:flex bg-[#3B82F6] hover:bg-blue-600">
                  إنشاء حساب
                </Button>
              </Link>
            </>
          )}

          <Button 
            variant="ghost" 
            className="md:hidden" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-[#334155]">
          <div className="flex flex-col space-y-2">
            <Link href="/">
              <a className={`px-3 py-2 rounded hover:bg-[#334155] transition ${isActive('/') ? 'bg-[#334155]' : ''}`}>
                الرئيسية
              </a>
            </Link>
            <a href="#cars" className="px-3 py-2 rounded hover:bg-[#334155] transition">
              السيارات
            </a>
            <a href="#videos" className="px-3 py-2 rounded hover:bg-[#334155] transition">
              الفيديوهات
            </a>
            <a href="#about" className="px-3 py-2 rounded hover:bg-[#334155] transition">
              عن المشروع
            </a>
            {!user && (
              <Link href="/auth">
                <Button className="w-full mt-2 bg-[#3B82F6] hover:bg-blue-600">
                  إنشاء حساب
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
