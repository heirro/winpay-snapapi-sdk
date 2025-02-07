// @ts-ignore
import crypto from 'crypto';
// @ts-ignore
import fs from 'fs';
// @ts-ignore
import path from 'path';

interface SignatureResult {
  signature: string;
  timestamp: string;
}

/**
 * Menghasilkan generateSignature RSA-SHA256 untuk autentikasi.
 *
 * @param httpMethod - Metode HTTP (GET, POST, dll.)
 * @param endpointUrl - URL endpoint API.
 * @param payload - Data payload dalam bentuk objek.
 * @returns Signature dan timestamp.
 */
export function generateSignature(
  httpMethod: string,
  endpointUrl: string,
  payload: Record<string, any>
): SignatureResult {
  // Tentukan path file private key
  const privateKeyPath = path.resolve(__dirname, 'privatekey.pem');

  // Baca private key dari file
  const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

  const options: Intl.DateTimeFormatOptions = { timeZone: 'Asia/Jakarta', hour12: false };
  const timestamp = new Date().toLocaleString('sv-SE', options).replace(' ', 'T') + '+07:00';

  // Hash body payload menggunakan SHA-256
  const body = JSON.stringify(payload);
  const hashedBody = crypto.createHash('sha256').update(body).digest('hex').toLowerCase();

  // Gabungkan string untuk signing
  const stringToSign = [httpMethod, endpointUrl, hashedBody, timestamp].join(':');

  // Hasilkan signature menggunakan private key
  const signature = crypto.sign('RSA-SHA256', Buffer.from(stringToSign), privateKey).toString('base64');

  return { signature, timestamp };
}
