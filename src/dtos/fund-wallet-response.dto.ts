export interface FundWalletInitResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export interface FundWalletVerifyResponse {
  status: string;
  reference: string;
  amount: number;
  paidAt: Date;
  channel: string;
  currency: string;
  transaction_id: number;
  customer: {
    email: string;
    customer_code?: string;
  };
}

export interface WalletFundingResponse {
  success: boolean;
  message: string;
  data?: {
    wallet_balance: number;
    transaction_reference: string;
    amount_funded: number;
  };
}