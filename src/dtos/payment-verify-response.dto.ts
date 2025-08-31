export interface PaymentVerifyResponse {
  status: string;
  reference: string;
  amount: number;
  paidAt: Date;
  channel: string;
  currency: string;
  customer: {
    email: string;
    username?: string;
  };
}
