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
export declare function generateSignature(httpMethod: string, endpointUrl: string, payload: Record<string, any>): SignatureResult;
export {};
