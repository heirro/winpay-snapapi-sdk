"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.virtual_account = virtual_account;
const generateSignature_1 = require("./generateSignature");
function virtual_account(customerNo_1, virtualAccountName_1, trxId_1, amountValue_1, currency_1, virtualAccountTrxType_1, bankCode_1, partnerId_1) {
    return __awaiter(this, arguments, void 0, function* (customerNo, // Customer number
    virtualAccountName, // Virtual account name
    trxId, // Transaction ID, now provided as input
    amountValue, // Total amount value
    currency, // Currency type (e.g., IDR)
    virtualAccountTrxType, // Transaction type for VA (e.g., 'c')
    bankCode, // Bank code (e.g., 'BRI')
    partnerId, // Partner ID for API authentication
    sandboxMode = false // Toggle for sandbox mode (default is false)
    ) {
        // Define date format options specific to Jakarta timezone
        const options = { timeZone: 'Asia/Jakarta', hour12: false };
        // Set the expiration date for the virtual account (24 hours from now)
        const expiredDate = new Date(Date.now() + 24 * 60 * 60 * 1000)
            .toLocaleString('sv-SE', options)
            .replace(' ', 'T') + '+07:00';
        // Construct the payload for the VA creation request
        const payload = {
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
        const { signature, timestamp } = (0, generateSignature_1.generateSignature)(httpMethod, endpointUrl, payload);
        // Convert payload to JSON string format for the request body
        const requestData = JSON.stringify(payload);
        // Set base URL depending on sandbox mode
        const baseUrl = sandboxMode ? 'https://sandbox-api.bmstaging.id/snap' : 'https://snap.winpay.id';
        // Make the API request using fetch
        const response = yield fetch(`${baseUrl}${endpointUrl}`, {
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
            throw new Error(`Request failed with status code ${response.status}: ${yield response.text()}`);
        }
        // Parse and return the response data
        const responseData = yield response.json();
        return { data: responseData };
    });
}
