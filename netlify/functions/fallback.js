// Netlify Serverless Function للاستخدام كإعادة توجيه احتياطية عندما يكون الخادم الرئيسي غير متاح
exports.handler = async function(event, context) {
  const path = event.path.replace('/.netlify/functions/fallback', '');
  
  // تحديد نوع الطلب الذي تم استلامه
  switch (path) {
    case '/api/health':
      return {
        statusCode: 200,
        body: JSON.stringify({ 
          status: "ok", 
          message: "الخادم الاحتياطي يعمل بشكل صحيح",
          mode: "fallback"
        })
      };
      
    case '/api/user':
      return {
        statusCode: 200,
        body: JSON.stringify({ 
          message: "تم تسجيل الدخول بنجاح (وضع احتياطي)",
          user: {
            id: 1,
            username: "مستخدم_احتياطي",
            name: "مستخدم افتراضي",
            role: "user",
            createdAt: new Date().toISOString()
          }
        })
      };
    
    case '/api/cars':
      return {
        statusCode: 307,
        headers: {
          "Location": "/.netlify/functions/auctions"
        }
      };
      
    default:
      return {
        statusCode: 200,
        body: JSON.stringify({ 
          message: "وظيفة الخادم الاحتياطي",
          path: path,
          timestamp: new Date().toISOString(),
          originalUrl: event.rawUrl
        })
      };
  }
};