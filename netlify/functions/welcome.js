// دالة ترحيب Netlify Serverless Function
exports.handler = async function(event, context) {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: "أهلا بك في منصة قلب للمزادات التفاعلية",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      environment: "Netlify Functions"
    })
  };
}
