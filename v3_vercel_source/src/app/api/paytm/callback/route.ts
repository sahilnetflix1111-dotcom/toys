import { NextResponse } from 'next/server';
import { PaytmChecksum } from '../../../../utils/paytmChecksum';

export async function POST(request: Request) {
  try {
    // Parse form-data sent by Paytm (standard callback format is application/x-www-form-urlencoded)
    const contentType = request.headers.get('content-type') || '';
    let paytmParams: Record<string, string> = {};

    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      formData.forEach((value, key) => {
        paytmParams[key] = value.toString();
      });
    } else {
      // Fallback for JSON requests (useful for custom mocks)
      paytmParams = await request.json();
    }

    console.log('Paytm Callback Received parameters:', paytmParams);

    const orderId = paytmParams.ORDERID || paytmParams.orderId || '';
    const txnAmount = paytmParams.TXNAMOUNT || paytmParams.txnAmount || '0';
    const txnId = paytmParams.TXNID || paytmParams.txnId || 'N/A';
    const status = paytmParams.STATUS || paytmParams.status || '';
    const respMsg = paytmParams.RESPMSG || paytmParams.respMsg || 'Transaction cancelled or failed.';
    const isMockCallback = paytmParams.isMock === 'true' || !process.env.PAYTM_MERCHANT_KEY;

    // Base redirection URL
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = host.startsWith('localhost') || host.startsWith('127.0.0.1') ? 'http' : 'https';
    const redirectBase = `${protocol}://${host}/payment-status`;

    // 1. If it's a simulated mock transaction, trust the mock state
    if (isMockCallback) {
      if (status === 'TXN_SUCCESS' || status === 'SUCCESS') {
        return NextResponse.redirect(
          `${redirectBase}?status=SUCCESS&orderId=${orderId}&txnId=${txnId}&amount=${txnAmount}`,
          { status: 303 }
        );
      } else {
        return NextResponse.redirect(
          `${redirectBase}?status=FAILED&orderId=${orderId}&respMsg=${encodeURIComponent(respMsg)}`,
          { status: 303 }
        );
      }
    }

    // 2. Real Paytm transaction verification
    const merchantKey = process.env.PAYTM_MERCHANT_KEY || '';
    const checksumHash = paytmParams.CHECKSUMHASH || '';

    // Remove ChecksumHash from params before signature verification
    const paramsToVerify = { ...paytmParams };
    delete paramsToVerify.CHECKSUMHASH;

    // Verify signature integrity
    const isSignatureValid = PaytmChecksum.verifySignature(
      paramsToVerify,
      merchantKey,
      checksumHash
    );

    if (!isSignatureValid) {
      console.error('Paytm signature verification failed!');
      return NextResponse.redirect(
        `${redirectBase}?status=FAILED&orderId=${orderId}&respMsg=Signature+Verification+Failed`,
        { status: 303 }
      );
    }

    // Check payment status from verified parameters
    if (status === 'TXN_SUCCESS') {
      return NextResponse.redirect(
        `${redirectBase}?status=SUCCESS&orderId=${orderId}&txnId=${txnId}&amount=${txnAmount}`,
        { status: 303 }
      );
    } else {
      return NextResponse.redirect(
        `${redirectBase}?status=FAILED&orderId=${orderId}&respMsg=${encodeURIComponent(respMsg)}`,
        { status: 303 }
      );
    }
  } catch (err: any) {
    console.error('Paytm Callback Handler Error:', err);
    // Redirect to a generic error page
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = host.startsWith('localhost') || host.startsWith('127.0.0.1') ? 'http' : 'https';
    return NextResponse.redirect(
      `${protocol}://${host}/payment-status?status=FAILED&respMsg=Server+Callback+Error`,
      { status: 303 }
    );
  }
}
