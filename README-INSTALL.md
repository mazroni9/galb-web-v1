# تعليمات تثبيت وتشغيل منصة قلب للمزادات

## متطلبات النظام
- Node.js (الإصدار 16 أو أعلى)
- NPM (مدير حزم Node)
- متصفح حديث

## خطوات الإعداد والتشغيل

1. فك ضغط الملف qalb-platform.tar.gz إلى مجلد جديد:
```
tar -xzvf qalb-platform.tar.gz -C my-auction-platform
cd my-auction-platform
```

2. قم بتثبيت الاعتمادات:
```
npm install
```

3. قم بتشغيل التطبيق محلياً:
```
npm run dev
```

4. قم ببناء نسخة الإنتاج:
```
npm run build
```

## نشر المشروع على Netlify

1. قم بإنشاء حساب على Netlify
2. انقر على "Import an existing project" أو "Deploy manually"
3. حدد الإعدادات التالية:
   - Base directory: .
   - Build command: npm run build
   - Publish directory: client/dist
   - Functions directory: netlify/functions

4. تأكد من إعداد متغيرات البيئة اللازمة في Netlify:
   - DATABASE_URL
   - PGDATABASE
   - PGUSER
   - PGPASSWORD
   - PGHOST
   - PGPORT

## ملاحظات هامة

- تأكد من إنشاء مجلد functions في Netlify لتجنب أخطاء النشر
- للحصول على مساعدة إضافية، تواصل مع فريق الدعم