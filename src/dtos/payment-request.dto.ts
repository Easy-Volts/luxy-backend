export class PaymentRequestDto {
  amount!: number;
  currency?: string;
  email?: string;
  username?: string;
  source?: string;
  userId!: number;
}
