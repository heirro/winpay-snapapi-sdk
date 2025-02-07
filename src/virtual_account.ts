import { generateSignature } from './generateSignature';

// Define the structure for the total amount object
interface TotalAmount {
  value: string;
  currency: string;
}

// Define the structure for additional information object
interface AdditionalInfo {
  channel: string;
}

// Define the payload structure for the VA request
interface VaPayload {
  customerNo: string;
  virtualAccountName: string;
  trxId: string;
  totalAmount: TotalAmount;
  virtualAccountTrxType: string;
  expiredDate: string;
  additionalInfo: AdditionalInfo;
}

// Define the structure for the VA response
interface VaResponse {
  data: any;
}

export async function virtual_account(
  customerNo: string, // Customer number
  virtualAccountName: string, // Virtual account name
  trxId: string, // Transaction ID, now provided as input
  amountValue: string, // Total amount value
  currency: string, // Currency type (e.g., IDR)
  virtualAccountTrxType: string, // Transaction type for VA (e.g., 'c')
  bankCode: string, // Bank code (e.g., 'BRI')
  partnerId: string, // Partner ID for API authentication
  sandboxMode: boolean = false // Toggle for sandbox mode (default is false)
): Promise<VaResponse> {
  // Define date format options specific to Jakarta timezone
  const options: Intl.DateTimeFormatOptions = { timeZone: 'Asia/Jakarta', hour12: false };

  // Set the expiration date for the virtual account (24 hours from now)
  const expiredDate = new Date(Date.now() + 24 * 60 * 60 * 1000)
    .toLocaleString('sv-SE', options)
    .replace(' ', 'T') + '+07:00';

  // Construct the payload for the VA creation request
  const payload: VaPayload = {
    customerNo: customerNo,
    virtualAccountName: virtualAccountName,
    trxId: trxId, // Use provided transaction ID
    totalAmount: {
      value: amountValue,
      currency: currency
    },
    virtualAccountTrxType: virtualAccountTrxType,
    expiredDate: expiredDate,
    additionalInfo: {
      channel: bankCode
    }
  };

  // Define HTTP method and API endpoint URL
  const httpMethod = 'POST';
  const endpointUrl = '/v1.0/transfer-va/create-va';

  // Generate signature and timestamp for API authentication
  const { signature, timestamp } = generateSignature(httpMethod, endpointUrl, payload);

  // Convert payload to JSON string format for the request body
  const requestData = JSON.stringify(payload);

  // Set base URL depending on sandbox mode
  const baseUrl = sandboxMode ? 'https://sandbox-api.bmstaging.id/snap' : 'https://snap.winpay.id';

  // Make the API request using fetch
  const response = await fetch(`${baseUrl}${endpointUrl}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Signature': signature, // Signature for request validation
      'X-Timestamp': timestamp, // Current timestamp
      'X-PARTNER-ID': partnerId, // Partner ID for API
      'X-EXTERNAL-ID': timestamp, // External ID, using the timestamp
      'CHANNEL-ID': bankCode // Channel ID, usually the bank code
    },
    body: requestData // Attach the payload in the request body
  });

  // Handle errors if the response is not successful
  if (!response.ok) {
    throw new Error(`Request failed with status code ${response.status}: ${await response.text()}`);
  }

  // Parse and return the response data
  const responseData = await response.json();
  return { data: responseData };
}