// Netlify Serverless Function للتحقق من حالة API
exports.handler = async function(event, context) {
  try {
    return {
      statusCode: 200,
      body: JSON.stringify({
        status: "online",
        message: "واجهة برمجة التطبيقات تعمل بشكل صحيح",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development",
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        status: "error", 
        message: "حدث خطأ في الخادم: " + error.message
      })
    };
  }
};