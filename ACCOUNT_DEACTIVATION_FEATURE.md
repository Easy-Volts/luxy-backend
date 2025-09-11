# Account Deactivation/Activation Feature

This feature allows Luxy users to deactivate and activate their accounts as shown in the mobile app settings.

## API Endpoints

### 1. Get Account Status
- **Endpoint**: `GET /users/account-status`
- **Description**: Retrieves current account status and available actions
- **Response**: 
  ```json
  {
    "message": "Account status retrieved successfully",
    "data": {
      "status": "ACTIVE",
      "lastUpdated": "2025-09-11T10:30:00Z",
      "canActivate": false,
      "canDeactivate": true
    }
  }
  ```

### 2. Deactivate Account
- **Endpoint**: `PATCH /users/deactivate`
- **Description**: Deactivates the current user's account
- **Request Body**:
  ```json
  {
    "reason": "Taking a break from the service" // optional
  }
  ```
- **Response**:
  ```json
  {
    "message": "Account deactivated successfully",
    "data": {
      "status": "INACTIVE",
      "reason": "Taking a break from the service",
      "deactivatedAt": "2025-09-11T10:30:00Z"
    }
  }
  ```

### 3. Activate Account
- **Endpoint**: `PATCH /users/activate`
- **Description**: Activates a deactivated account
- **Request Body**:
  ```json
  {
    "note": "Ready to use the service again" // optional
  }
  ```
- **Response**:
  ```json
  {
    "message": "Account activated successfully",
    "data": {
      "status": "ACTIVE",
      "note": "Ready to use the service again",
      "activatedAt": "2025-09-11T10:30:00Z"
    }
  }
  ```

## User Status Enum

- `ACTIVE`: User can access all features
- `INACTIVE`: User account is deactivated (can be reactivated)
- `SUSPENDED`: Account suspended by admin (contact support)
- `DELETED`: Account marked for deletion (contact support)

## Security Features

1. **Account Status Guard**: Prevents deactivated users from accessing protected routes
2. **Allow Inactive Decorator**: Special endpoints like `/activate` can be accessed by inactive users
3. **Validation**: Prevents invalid status transitions (e.g., activating already active account)

## Frontend Integration

The mobile app settings screen should:
1. Call `GET /users/account-status` to show current status
2. Show deactivate button when `canDeactivate` is true
3. Show activate option when user is inactive
4. Handle the confirmation dialog as shown in the UI mockup

## Database Changes

The feature uses the existing `status` field in the `users` table with these values:
- ACTIVE
- INACTIVE  
- SUSPENDED
- DELETED

No database migrations are required as the enum and field already exist.
