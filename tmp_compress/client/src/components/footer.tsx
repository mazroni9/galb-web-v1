import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="bg-[#1E293B] border-t border-[#334155] py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">
              <span className="text-[#F59E0B]">قلب</span>{" "}
              <span className="text-[#3B82F6]">Galb</span>
            </h3>
            <p className="text-gray-400 text-sm">
              منصة متخصصة في عرض أجمل وأحدث السيارات الفاخرة والرياضية حول العالم، مع تغطية شاملة لأخبار وتجارب القيادة.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">روابط سريعة</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/">
                  <a className="text-gray-300 hover:text-[#3B82F6] transition">الصفحة الرئيسية</a>
                </Link>
              </li>
              <li>
                <a href="#cars" className="text-gray-300 hover:text-[#3B82F6] transition">السيارات الفاخرة</a>
              </li>
              <li>
                <a href="#videos" className="text-gray-300 hover:text-[#3B82F6] transition">تجارب القيادة</a>
              </li>
              <li>
                <a href="#latest" className="text-gray-300 hover:text-[#3B82F6] transition">أحدث الإصدارات</a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">العلامات التجارية</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-300 hover:text-[#3B82F6] transition">مرسيدس</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#3B82F6] transition">بي إم دبليو</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#3B82F6] transition">بورش</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#3B82F6] transition">فيراري</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#3B82F6] transition">لامبورغيني</a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">تواصل معنا</h4>
            <div className="flex space-x-4 space-x-reverse mb-4">
              <a href="#" className="text-gray-400 hover:text-[#3B82F6] transition">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-[#3B82F6] transition">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-[#3B82F6] transition">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-[#3B82F6] transition">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
            <p className="text-sm text-gray-400">اشترك في النشرة البريدية</p>
            <div className="flex mt-2">
              <Input 
                type="email" 
                placeholder="بريدك الإلكتروني" 
                className="bg-[#0F172A] border-[#334155] text-white rounded-r-md rounded-l-none flex-1" 
              />
              <Button className="rounded-l-md rounded-r-none bg-[#3B82F6] hover:bg-blue-600">
                اشتراك
              </Button>
            </div>
          </div>
        </div>
        <div className="border-t border-[#334155] mt-8 pt-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Galb - قلب. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
}
