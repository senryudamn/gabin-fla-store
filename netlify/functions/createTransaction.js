const crypto = require('crypto');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { orderId, grossAmount, customerName, phone } = JSON.parse(event.body);

  // Kunci rahasia diambil murni dari Environment Variables Netlify
  const merchantCode = process.env.VITE_DUITKU_MERCHANT_CODE;
  const apiKey = process.env.DUITKU_API_KEY;

  if (!merchantCode || !apiKey) {
    return { statusCode: 500, body: JSON.stringify({ success: false, error: 'Konfigurasi kredensial Duitku tidak ditemukan di server.' }) };
  }

  const amount = Math.round(grossAmount);
  const signatureString = merchantCode + orderId + amount + apiKey;
  const signature = crypto.createHash('md5').update(signatureString).digest('hex');

  const payload = {
    merchantCode: merchantCode,
    paymentAmount: amount,
    merchantOrderId: orderId,
    productDetails: 'DP Pesanan Gabin Fla',
    email: 'customer@gabinpermata.com',
    phoneNumber: phone,
    customerVaName: customerName,
    itemDetails: [{
      name: 'DP Gabin Fla',
      price: amount,
      quantity: 1
    }],
    customerDetail: {
      firstName: customerName,
      lastName: '',
      email: 'customer@gabinpermata.com',
      phoneNumber: phone
    },
    returnUrl: 'https://gabinpermata.netlify.app',
    callbackUrl: 'https://gabinpermata.netlify.app/.netlify/functions/webhook',
    signature: signature,
    expiryPeriod: 60
  };

  try {
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
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: data.statusMessage })
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};
