export interface WalletFundingResponse {
  success: boolean;
  message: string;
  data?: {
    wallet_balance: number;
    transaction_reference: string;
    amount_funded: number;
  };
}
