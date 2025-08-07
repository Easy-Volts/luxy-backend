# Review and Rating API Documentation

This API provides endpoints for managing reviews and ratings in the Luxy Backend application.

## Overview

The Review and Rating system allows users to:
- Create reviews with 1-5 star ratings
- View reviews by user, reviewer, or car
- Get aggregated rating statistics 
- Update and delete their own reviews

## Endpoints

### 1. Create Review
**POST** `/reviews`

Creates a new review.

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Great car and excellent service!",
  "revieweeId": 123,
  "carId": 456,
  "reviewType": "CAR_OWNER",
  "bookingId": 789
}
```

**Response:**
```json
{
  "success": true,
  "message": "Review created successfully",
  "data": {
    "id": 1,
    "rating": 5,
    "comment": "Great car and excellent service!",
    "reviewerId": 100,
    "revieweeId": 123,
    "carId": 456,
    "reviewType": "CAR_OWNER",
    "bookingId": 789,
    "isActive": true,
    "dateCreated": "2025-08-07T09:41:00.000Z",
    "lastUpdated": "2025-08-07T09:41:00.000Z"
  }
}
```

### 2. Get Review by ID
**GET** `/reviews/{id}`

Retrieves a specific review by its ID.

### 3. Get Reviews for a User (Reviewee)
**GET** `/reviews/user/{userId}?reviewType=CAR_OWNER`

Retrieves all reviews for a specific user (the person being reviewed).

**Query Parameters:**
- `reviewType` (optional): Filter by review type (`CAR_OWNER`, `RENTER`, `CAR`)

### 4. Get Reviews by Reviewer
**GET** `/reviews/reviewer/{reviewerId}`

Retrieves all reviews written by a specific user.

### 5. Get Reviews for a Car
**GET** `/reviews/car/{carId}`

Retrieves all reviews for a specific car.

### 6. Get Review Statistics
**GET** `/reviews/stats/{userId}?reviewType=CAR_OWNER`

Retrieves aggregated statistics for a user's reviews.

**Response:**
```json
{
  "success": true,
  "message": "Review statistics retrieved successfully",
  "data": {
    "averageRating": 4.5,
    "totalReviews": 367,
    "ratingDistribution": [
      { "rating": 5, "count": 316, "percentage": 86 },
      { "rating": 4, "count": 59, "percentage": 16 },
      { "rating": 3, "count": 44, "percentage": 12 },
      { "rating": 2, "count": 29, "percentage": 8 },
      { "rating": 1, "count": 15, "percentage": 4 }
    ]
  }
}
```

### 7. Update Review
**PUT** `/reviews/{id}`

Updates an existing review. Only the review author can update their own reviews.

**Request Body:**
```json
{
  "rating": 4,
  "comment": "Updated review comment"
}
```

### 8. Delete Review
**DELETE** `/reviews/{id}`

Soft deletes a review. Only the review author can delete their own reviews.

### 9. Get Current User's Reviews
**GET** `/reviews/my/reviews`

Retrieves all reviews written by the currently authenticated user.

## Review Types

The system supports three types of reviews:

1. **CAR_OWNER** - Reviews about car owners (by renters)
2. **RENTER** - Reviews about renters (by car owners) 
3. **CAR** - Reviews about cars themselves

## Authentication

All endpoints require authentication via Bearer token. The following user roles have access:
- `CUSTOMER`
- `ADMIN`

## Data Models

### Review Entity
- `id`: Unique review identifier
- `rating`: Integer from 1-5 stars
- `comment`: Optional text comment
- `reviewerId`: ID of user writing the review
- `revieweeId`: ID of user being reviewed
- `carId`: Optional ID of car being reviewed
- `reviewType`: Type of review (CAR_OWNER, RENTER, CAR)
- `bookingId`: Optional ID of associated booking
- `isActive`: Boolean flag for soft deletion
- `dateCreated`: Timestamp of creation
- `lastUpdated`: Timestamp of last update

### Review Statistics
- `averageRating`: Calculated average rating (rounded to 1 decimal)
- `totalReviews`: Total count of active reviews
- `ratingDistribution`: Array of rating counts and percentages

## Error Handling

The API returns standardized error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common error scenarios:
- 400: Invalid input data (e.g., rating outside 1-5 range)
- 401: Unauthorized (missing or invalid token)
- 403: Forbidden (trying to update/delete someone else's review)
- 404: Resource not found (review, user, or car doesn't exist)

## Validation Rules

- Rating must be between 1 and 5 (inclusive)
- Comment is optional but if provided must be a string
- Users cannot review themselves (reviewerId ≠ revieweeId)
- Only review authors can update or delete their reviews
- All required fields must be provided when creating reviews
