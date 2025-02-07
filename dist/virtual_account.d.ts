interface VaResponse {
    data: any;
}
export declare function virtual_account(customerNo: string, // Customer number
virtualAccountName: string, // Virtual account name
trxId: string, // Transaction ID, now provided as input
amountValue: string, // Total amount value
currency: string, // Currency type (e.g., IDR)
virtualAccountTrxType: string, // Transaction type for VA (e.g., 'c')
bankCode: string, // Bank code (e.g., 'BRI')
partnerId: string, // Partner ID for API authentication
sandboxMode?: boolean): Promise<VaResponse>;
export {};
