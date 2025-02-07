"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSignature = generateSignature;
// @ts-ignore
const crypto_1 = require("crypto");
// @ts-ignore
const fs_1 = require("fs");
// @ts-ignore
const path_1 = require("path");
/**
 * Menghasilkan generateSignature RSA-SHA256 untuk autentikasi.
 *
 * @param httpMethod - Metode HTTP (GET, POST, dll.)
 * @param endpointUrl - URL endpoint API.
 * @param payload - Data payload dalam bentuk objek.
 * @returns Signature dan timestamp.
 */
function generateSignature(httpMethod, endpointUrl, payload) {
    // Tentukan path file private key
    const privateKeyPath = path_1.default.resolve(__dirname, 'privatekey.pem');
    // Baca private key dari file
    const privateKey = fs_1.default.readFileSync(privateKeyPath, 'utf8');
    const options = { timeZone: 'Asia/Jakarta', hour12: false };
    const timestamp = new Date().toLocaleString('sv-SE', options).replace(' ', 'T') + '+07:00';
    // Hash body payload menggunakan SHA-256
    const body = JSON.stringify(payload);
    const hashedBody = crypto_1.default.createHash('sha256').update(body).digest('hex').toLowerCase();
    // Gabungkan string untuk signing
    const stringToSign = [httpMethod, endpointUrl, hashedBody, timestamp].join(':');
    // Hasilkan signature menggunakan private key
    const signature = crypto_1.default.sign('RSA-SHA256', Buffer.from(stringToSign), privateKey).toString('base64');
    return { signature, timestamp };
}
