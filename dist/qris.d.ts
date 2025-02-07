interface QrisResponse {
    data: any;
}
export declare function qris(partnerReferenceNo: string, // Unique partner reference number
amountValue: string, // Total amount value
currency: string, // Currency type (e.g., IDR)
partnerId: string, // Partner ID for API authentication
sandboxMode?: boolean, // Toggle for sandbox mode (default is false)
isStatic?: boolean): Promise<QrisResponse>;
export {};
