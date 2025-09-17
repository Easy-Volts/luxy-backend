# Wallet Funding with Paystack Integration

This implementation provides a complete wallet funding system using Paystack payment gateway.

## Features

- ✅ Initialize wallet funding via Paystack
- ✅ Verify and process successful payments
- ✅ Handle Paystack webhooks/callbacks
- ✅ Update wallet balance automatically
- ✅ Transaction logging and tracking
- ✅ Wallet balance retrieval
- ✅ Input validation and error handling

## API Endpoints

### 1. Initiate Wallet Funding
**POST** `/wallet/fund/initiate`

**Headers:**
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "amount": 1000,
  "currency": "NGN",
  "email": "user@example.com",
  "callback_url": "https://your-app.com/callback",
  "metadata": {
    "description": "Wallet funding"
  }
}
```

**Response:**
```json
{
  "authorization_url": "https://checkout.paystack.com/xyz123",
  "access_code": "xyz123",
  "reference": "ref_1234567890"
}
```

### 2. Verify Wallet Funding
**POST** `/wallet/fund/verify/{reference}`

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "success": true,
  "message": "Wallet funded successfully",
  "data": {
    "wallet_balance": 5000,
    "transaction_reference": "ref_1234567890",
    "amount_funded": 1000
  }
}
```

### 3. Paystack Webhook Handler
**POST** `/wallet/fund/callback`

This endpoint handles Paystack webhooks automatically when payments are completed.

**Request Body (from Paystack):**
```json
{
  "event": "charge.success",
  "data": {
    "reference": "ref_1234567890",
    "amount": 100000,
    "status": "success"
  }
}
```

### 4. Get Wallet Balance
**GET** `/wallet/balance`

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "balance": 5000,
    "currency": "NGN"
  }
}
```

### 5. Get Wallet Details
**GET** `/wallet/details`

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 123,
    "balance": 5000,
    "currency": "NGN",
    "status": "ACTIVE",
    "accountNumber": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## Environment Variables

Make sure these environment variables are set in your `.env` file:

```properties
PAYSTACK_SECRET_KEY=sk_test_your_secret_key
PAYSTACK_PUBLIC_KEY=pk_test_your_public_key
PAYSTACK_CURRENCY=NGN
PAYSTACK_MIN_AMOUNT=100
PAYSTACK_MAX_AMOUNT=1000000
```

## Integration Flow

### Frontend Integration

1. **Initiate Payment:**
   ```javascript
   const response = await fetch('/wallet/fund/initiate', {
     method: 'POST',
     headers: {
       'Authorization': `Bearer ${token}`,
       'Content-Type': 'application/json'
     },
     body: JSON.stringify({
       amount: 1000,
       email: 'user@example.com'
     })
   });
   
   const { authorization_url } = await response.json();
   // Redirect user to authorization_url
   window.location.href = authorization_url;
   ```

2. **Handle Return (Optional):**
   After payment, user is redirected back to your callback URL. You can then verify the payment:
   
   ```javascript
   const urlParams = new URLSearchParams(window.location.search);
   const reference = urlParams.get('reference');
   
   if (reference) {
     const response = await fetch(`/wallet/fund/verify/${reference}`, {
       method: 'POST',
       headers: {
         'Authorization': `Bearer ${token}`
       }
     });
     
     const result = await response.json();
     if (result.success) {
       // Show success message
       console.log('Wallet funded successfully!');
       console.log('New balance:', result.data.wallet_balance);
     }
   }
   ```

### Backend Webhook Setup

Configure your Paystack webhook URL to point to: `https://your-domain.com/wallet/fund/callback`

The webhook will automatically handle successful payments and update wallet balances.

## Security Features

- ✅ JWT authentication required for all endpoints
- ✅ Input validation using class-validator
- ✅ Amount limits (min/max) enforcement
- ✅ Transaction reference verification
- ✅ Duplicate payment prevention
- ✅ Comprehensive error handling and logging

## Database Tables

### Wallet Table
- `id` - Primary key
- `userId` - Foreign key to user
- `balance` - Decimal(18,2) current balance
- `currency` - VARCHAR(10) currency code
- `status` - VARCHAR(20) wallet status
- `accountNumber` - Optional account number
- `createdAt` - Timestamp
- `updatedAt` - Timestamp

### Transaction Table
- `id` - Primary key
- `reference` - Paystack reference (unique)
- `code` - Transaction code/type
- `status` - Transaction status
- `amount` - Transaction amount
- `userId` - Foreign key to user
- `paymentType` - Payment method enum
- `dateCreated` - Timestamp
- `lastUpdated` - Timestamp

## Error Handling

The system includes comprehensive error handling for:

- Invalid amounts (below minimum or above maximum)
- Payment verification failures
- Wallet not found scenarios
- Network errors with Paystack
- Duplicate transaction processing
- Database operation failures

## Testing

Run the wallet service tests:

```bash
npm test -- wallet.service.spec.ts
```

## Monitoring

All operations are logged using the CustomLogger service. Monitor logs for:

- Payment initiation attempts
- Successful wallet funding
- Failed transactions
- Error conditions

## Support

For issues or questions about the wallet funding implementation, check the logs and ensure:

1. Paystack credentials are correctly configured
2. Webhook URL is properly set up in Paystack dashboard
3. Database tables exist and are accessible
4. Network connectivity to Paystack API is working