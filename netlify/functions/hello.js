// دالة Netlify Serverless Function بسيطة
exports.handler = async function(event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "مرحباً بك في منصة قلب للمزادات!" })
  };
}
