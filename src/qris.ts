import { generateSignature } from './generateSignature';

// Define the structure for the amount object
interface Amount {
  value: string;
  currency: string;
}

// Define the structure for additional information object
interface AdditionalInfo {
  isStatic: boolean;
}

// Define the payload structure for the QRIS request
interface QrisPayload {
  partnerReferenceNo: string;
  amount: Amount;
  validityPeriod?: string;
  additionalInfo: AdditionalInfo;
}

// Define the structure for the QRIS response
interface QrisResponse {
  data: any;
}

export async function qris(
  partnerReferenceNo: string, // Unique partner reference number
  amountValue: string, // Total amount value
  currency: string, // Currency type (e.g., IDR)
  partnerId: string, // Partner ID for API authentication
  sandboxMode: boolean = false, // Toggle for sandbox mode (default is false)
  isStatic: boolean = true, // Determines if the QR code is static or dynamic
): Promise<QrisResponse> {
  // Define date format options specific to Jakarta timezone
  const options: Intl.DateTimeFormatOptions = { timeZone: 'Asia/Jakarta', hour12: false };

  // Set the expiration date for the QR code (24 hours from now if dynamic)
  const expiredDate = new Date(Date.now() + 24 * 60 * 60 * 1000)
    .toLocaleString('sv-SE', options)
    .replace(' ', 'T') + '+07:00';

  // Construct the payload for the QRIS creation request
  const payload: QrisPayload = {
    partnerReferenceNo: partnerReferenceNo,
    amount: {
      value: amountValue,
      currency: currency
    },
    additionalInfo: {
      isStatic: isStatic
    }
  };

  // Add validity period if QR code is dynamic
  if (!isStatic) {
    payload.validityPeriod = expiredDate;
  }

  // Define HTTP method and API endpoint URL
  const httpMethod = 'POST';
  const endpointUrl = '/v1.0/qr/qr-mpm-generate';

  // Generate signature and timestamp for API authentication
  const { signature, timestamp } = generateSignature(httpMethod, endpointUrl, payload);

  // Set base URL depending on sandbox mode
  const baseUrl = sandboxMode ? 'https://sandbox-api.bmstaging.id/snap' : 'https://snap.winpay.id';

  // Define headers for the API request
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Signature': signature, // Signature for request validation
    'X-Timestamp': timestamp, // Current timestamp
    'X-PARTNER-ID': partnerId, // Partner ID for API
    'X-EXTERNAL-ID': timestamp, // External ID, using the timestamp
    'CHANNEL-ID': 'QRIS' // Channel ID, specifying QRIS
  };

  try {
    // Make the API request using fetch
    const response = await fetch(`${baseUrl}${endpointUrl}`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    });

    // Handle errors if the response is not successful
    if (!response.ok) {
      throw new Error(`Request failed with status code ${response.status}: ${await response.text()}`);
    }

    // Parse and return the response data
    const data = await response.json();
    return { data };
  } catch (error) {
    // Handle any errors that occur during the request
    throw new Error(`Request error: ${(error as Error).message}`);
  }
}
