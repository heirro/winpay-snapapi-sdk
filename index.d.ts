// index.d.ts

export interface QrisResponse {
  data: any;
}

export interface VaResponse {
  data: any;
}

export function qris(
  partnerReferenceNo: string,
  amountValue: string,
  currency: string,
  isStatic: boolean,
  partnerId: string,
  sandboxMode?: boolean
): Promise<QrisResponse>;

export function virtual_account(
  customerNo: string,
  virtualAccountName: string,
  amountValue: string,
  currency: string,
  virtualAccountTrxType: string,
  bankCode: string,
  partnerId: string,
  sandboxMode?: boolean
): Promise<VaResponse>;

export function signature(
  httpMethod: string,
  endpointUrl: string,
  payload: object,
  privateKey: string
): { signature: string; timestamp: string };
