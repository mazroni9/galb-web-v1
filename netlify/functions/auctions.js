// Netlify Serverless Function لتوفير بيانات المزادات عندما يكون الخادم الرئيسي غير متاح
exports.handler = async function(event, context) {
  // هذه الوظيفة توفر بيانات احتياطية للمزادات عندما يكون الخادم الرئيسي غير متاح
  
  const mockAuctions = [
    {
      id: 1,
      title: "مرسيدس S-Class موديل 2023",
      type: "مباشر",
      startingPrice: 350000,
      currentBid: 375000,
      minimumBid: 360000,
      status: "جاري",
      endTime: new Date(Date.now() + 3600000).toISOString(),
      imageUrl: "https://source.unsplash.com/random/800x600/?mercedes"
    },
    {
      id: 2,
      title: "بي ام دبليو X7 موديل 2022",
      type: "فوري",
      startingPrice: 280000,
      currentBid: 295000,
      minimumBid: 290000,
      status: "جاري",
      endTime: new Date(Date.now() + 7200000).toISOString(),
      imageUrl: "https://source.unsplash.com/random/800x600/?bmw"
    },
    {
      id: 3,
      title: "لكزس LX570 موديل 2023",
      type: "صامت",
      startingPrice: 420000,
      currentBid: 440000,
      minimumBid: 425000,
      status: "جاري",
      endTime: new Date(Date.now() + 10800000).toISOString(),
      imageUrl: "https://source.unsplash.com/random/800x600/?lexus"
    }
  ];

  try {
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: JSON.stringify({
        status: "success",
        message: "تم استرجاع بيانات المزادات بنجاح",
        data: mockAuctions
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        status: "error", 
        message: "حدث خطأ في استرجاع بيانات المزادات: " + error.message 
      })
    };
  }
};