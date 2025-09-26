import { PaymentMethod } from 'src/enums/user.enum';

export class PaymentRequestDto {
  amount!: number;
  currency?: string;
  email?: string;
  username?: string;
  source?: string;
  userId!: number;
  paymentMethod?: PaymentMethod;
}
