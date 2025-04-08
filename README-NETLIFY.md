# إعداد وتكوين Netlify لمنصة قلب

## ملفات التكوين المهمة

### 1. ملف netlify.toml
يحتوي هذا الملف على تكوين Netlify الرئيسي للمشروع بما في ذلك إعدادات البناء والوظائف والتوجيهات.

### 2. ملف client/public/_redirects
ملف إضافي لضمان عمل التوجيهات بشكل صحيح.

### 3. وظائف Netlify السحابية (Netlify Functions)
تم إنشاء عدة ملفات وظائف في مجلد netlify/functions لتوفير APIs احتياطية.

### 4. صفحة اختبار الوظائف
تم إنشاء صفحة functions-test.html لاختبار جميع وظائف Netlify.

## خطوات النشر على Netlify

1. قم بتجهيز مشروع GitHub وربطه مع Netlify
2. حدد إعدادات البناء: publish = "client/dist", command = "npm run build", functions = "netlify/functions"
3. قم بإعداد متغيرات البيئة اللازمة (DATABASE_URL, PGDATABASE, PGUSER, الخ)
4. تأكد من تكوين مجال مخصص إذا لزم الأمر
5. بعد النشر، تحقق من عمل الوظائف عبر زيارة /functions-test.html

## مشاكل شائعة وحلولها

1. مشكلة: وظائف Netlify لا تعمل
   - الحل: تأكد من وجود مجلد netlify/functions وملف _redirects

2. مشكلة: لا يمكن الوصول إلى API
   - الحل: تأكد من أن الخادم الخلفي يعمل وأن الرابط في netlify.toml صحيح

3. مشكلة: صفحة فارغة بعد النشر
   - الحل: تأكد من وجود ملف _redirects في مجلد client/public
