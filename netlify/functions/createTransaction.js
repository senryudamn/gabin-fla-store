const crypto = require('crypto');

exports.handler = async function(event, context) {
  // Hanya terima method POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { orderId, grossAmount, customerName, phone } = JSON.parse(event.body);

  // Tarik kunci rahasia dari Netlify Environment Variables
  const merchantCode = process.env.VITE_DUITKU_MERCHANT_CODE || 'DS34617';
  const apiKey = process.env.DUITKU_API_KEY || 'f0bb386eac4aad9458aa3339e0b53b44';

  // 1. Buat Tanda Tangan Digital (Signature) Duitku
  const amount = Math.round(grossAmount);
  const signatureString = merchantCode + orderId + amount + apiKey;
  const signature = crypto.createHash('md5').update(signatureString).digest('hex');

  // 2. Rakit Data Pesanan
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
