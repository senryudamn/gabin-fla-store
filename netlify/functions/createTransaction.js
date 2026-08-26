const crypto = require('crypto');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { orderId, grossAmount, customerName, phone } = JSON.parse(event.body);

    // Kunci diambil dari Netlify Environment Variables
    const merchantCode = process.env.VITE_DUITKU_MERCHANT_CODE;
    const apiKey = process.env.DUITKU_API_KEY;

    if (!merchantCode || !apiKey) {
      return { 
        statusCode: 200, 
        body: JSON.stringify({ success: false, error: 'Kredensial Duitku tidak ditemukan di server Netlify.' }) 
      };
    }

    const amount = Math.round(grossAmount);
    
    // Pastikan tidak ada spasi tidak sengaja (trim)
    const cleanMerchantCode = merchantCode.trim();
    const cleanApiKey = apiKey.trim();

    // 1. Buat Tanda Tangan Digital (Signature) Duitku
    const signatureString = cleanMerchantCode + orderId + amount + cleanApiKey;
    const signature = crypto.createHash('md5').update(signatureString).digest('hex');

    // 2. Rakit Data Pesanan (Sangat Minimalis & Sesuai Standar Mutlak Duitku)
    const payload = {
      paymentMethod: "", // WAJIB ADA: Kosongkan agar muncul semua opsi bayar
      merchantCode: cleanMerchantCode,
      paymentAmount: amount,
      merchantOrderId: orderId,
      productDetails: 'DP Pesanan Gabin Fla',
      email: 'customer@gabinpermata.com', // Dummy email karena Duitku mewajibkan format @
      phoneNumber: phone.trim(),
      additionalParam: '',
      merchantUserInfo: '',
      customerVaName: customerName.trim(),
      callbackUrl: 'https://gabinpermata.netlify.app/.netlify/functions/webhook',
      returnUrl: 'https://gabinpermata.netlify.app',
      signature: signature,
      expiryPeriod: 60
    };

    // 3. Tembak server Duitku Sandbox
    const response = await fetch('https://sandbox.duitku.com/webapi/api/merchant/v2/inquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (data.statusCode === '00') {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, paymentUrl: data.paymentUrl })
      };
    } else {
      // Jika Duitku masih menolak, catat alasan penolakannya di Log Netlify!
      console.log("DUITKU REJECT REASON:", data.statusMessage);
      return {
        statusCode: 200,
        body: JSON.stringify({ success: false, error: data.statusMessage })
      };
    }
  } catch (error) {
    console.error("Function Crash:", error.message);
    return {
      statusCode: 200,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};
