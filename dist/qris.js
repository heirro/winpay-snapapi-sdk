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
exports.qris = qris;
const generateSignature_1 = require("./generateSignature");
function qris(partnerReferenceNo_1, amountValue_1, currency_1, partnerId_1) {
    return __awaiter(this, arguments, void 0, function* (partnerReferenceNo, // Unique partner reference number
    amountValue, // Total amount value
    currency, // Currency type (e.g., IDR)
    partnerId, // Partner ID for API authentication
    sandboxMode = false, // Toggle for sandbox mode (default is false)
    isStatic = true) {
        // Define date format options specific to Jakarta timezone
        const options = { timeZone: 'Asia/Jakarta', hour12: false };
        // Set the expiration date for the QR code (24 hours from now if dynamic)
        const expiredDate = new Date(Date.now() + 24 * 60 * 60 * 1000)
            .toLocaleString('sv-SE', options)
            .replace(' ', 'T') + '+07:00';
        // Construct the payload for the QRIS creation request
        const payload = {
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
        const { signature, timestamp } = (0, generateSignature_1.generateSignature)(httpMethod, endpointUrl, payload);
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
            const response = yield fetch(`${baseUrl}${endpointUrl}`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload)
            });
            // Handle errors if the response is not successful
            if (!response.ok) {
                throw new Error(`Request failed with status code ${response.status}: ${yield response.text()}`);
            }
            // Parse and return the response data
            const data = yield response.json();
            return { data };
        }
        catch (error) {
            // Handle any errors that occur during the request
            throw new Error(`Request error: ${error.message}`);
        }
    });
}
