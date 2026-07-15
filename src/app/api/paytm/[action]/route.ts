import { NextResponse } from 'next/server';
import { PaytmChecksum } from '../../../../utils/paytmChecksum';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, customer, items, paytmConfig } = body;

    if (!amount || typeof amount !== 'number') {
      return NextResponse.json({ message: 'Invalid or missing amount' }, { status: 400 });
    }

    // Generate a unique order ID
    const timestamp = Date.now();
    const random = Math.floor(1000 + Math.random() * 9000);
    const orderId = `LP-ORD-${timestamp}-${random}`;

    // Read dynamic configuration falling back to environment variables
    const mid = paytmConfig?.mid || process.env.PAYTM_MID;
    const merchantKey = paytmConfig?.merchantKey || process.env.PAYTM_MERCHANT_KEY;
    const website = paytmConfig?.website || process.env.PAYTM_WEBSITE || 'DEFAULT';
    const channelId = paytmConfig?.channelId || process.env.PAYTM_CHANNEL_ID || 'WEB';
    const environment = paytmConfig?.environment || process.env.PAYTM_ENVIRONMENT || 'SIMULATED';

    const isMock = environment === 'SIMULATED' || !mid || !merchantKey;

    // Determine host and protocol dynamically for the callback
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = host.startsWith('localhost') || host.startsWith('127.0.0.1') ? 'http' : 'https';
    const callbackUrl = `${protocol}://${host}/api/paytm/callback`;

    // If simulated or keys are missing, fallback to mock mode
    if (isMock) {
      console.log('--- SIMULATED PAYTM TRANSACTION ACTIVE ---');
      console.log(`Initiating mock order: ${orderId} for ₹${amount}`);
      return NextResponse.json({
        isMock: true,
        orderId,
        amount,
        callbackUrl,
        message: 'Running in simulated transaction mode.'
      });
    }

    // Production/Staging Paytm integration
    const paytmParams: any = {
      body: {
        requestType: 'Payment',
        mid: mid,
        websiteName: website,
        orderId: orderId,
        callbackUrl: callbackUrl,
        txnAmount: {
          value: amount.toFixed(2),
          currency: 'INR',
        },
        userInfo: {
          custId: `CUST_${customer.phone || 'GUEST'}`,
          mobile: customer.phone,
          email: 'customer@feelthewellness.com'
        },
      },
    };

    // Generate signature on body
    const signature = PaytmChecksum.generateSignature(
      JSON.stringify(paytmParams.body),
      merchantKey
    );

    paytmParams.head = {
      signature: signature,
    };

    // Paytm API Endpoint
    // Staging endpoint or Production endpoint based on config
    const isProd = environment === 'PROD';
    const paytmHost = isProd ? 'securegw.paytm.in' : 'securegw-stage.paytm.in';
    const paytmUrl = `https://${paytmHost}/theia/api/v1/initiateTransaction?mid=${mid}&orderId=${orderId}`;

    const apiResponse = await fetch(paytmUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paytmParams),
    });

    const responseData = await apiResponse.json();

    if (responseData.body && responseData.body.resultInfo.resultStatus === 'S') {
      return NextResponse.json({
        isMock: false,
        txnToken: responseData.body.txnToken,
        orderId: orderId,
        mid: mid,
        amount: amount,
        callbackUrl: callbackUrl
      });
    } else {
      return NextResponse.json({
        message: responseData.body?.resultInfo?.resultMsg || 'Transaction token generation failed.',
        details: responseData
      }, { status: 500 });
    }
  } catch (err: any) {
    console.error('Paytm Initiate Error:', err);
    return NextResponse.json({ message: 'Internal Server Error', error: err.message }, { status: 500 });
  }
}
