# Stripe Integration Setup for TROMS

## Overview
This integration adds dynamic subscription plan fetching and Stripe payment processing to the TROMS fitness app subscription page.

## Features Added

### 1. Dynamic Subscription Plans
- Fetches subscription plans from backend API: `http://localhost:5010/api/v1/stripeWEB/get-subscription-plans`
- Displays plans dynamically instead of hardcoded monthly/yearly options
- Shows plan name, price, and billing interval

### 2. Stripe Payment Integration
- Integrated Stripe Elements for secure card input
- Uses `@stripe/react-stripe-js` for React components
- Processes payments through backend API: `http://localhost:5010/api/v1/stripeWEB/purchase-subscription/{priceId}`
- Properly handles payment methods and customer creation

### 3. User Context Integration
- Uses existing OnboardingContext for user authentication
- Passes correct `userInfoId` to backend for subscription association
- Maintains existing authentication flow

## Setup Instructions

### 1. Environment Variables
Create or update your `.env.local` file with:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:5010/api/v1

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_stripe_publishable_key_here
```

### 2. Backend Requirements
Ensure your backend is running on `http://localhost:5010` with the following endpoints:

- `GET /api/v1/stripeWEB/get-subscription-plans` - Returns subscription plans
- `POST /api/v1/stripeWEB/purchase-subscription/{priceId}` - Creates subscription

### 3. Dependencies
Already installed:
```bash
npm install @stripe/react-stripe-js
```

## Files Modified

### Frontend Changes
1. **`app/(frontpage)/subscriptions/page.jsx`**
   - Converted to client component with hooks
   - Added dynamic plan fetching
   - Integrated Stripe payment form
   - Added error handling and loading states

2. **`lib/api.js`**
   - Added `getSubscriptionPlans()` method
   - Added `purchaseSubscription()` method
   - Updated base URL to use environment variable

3. **`lib/stripe.js`** (New file)
   - Stripe utility functions
   - Payment method creation helpers

4. **`env.example`**
   - Added Stripe configuration example

## Usage

### User Flow
1. User navigates to `/subscriptions`
2. Page loads subscription plans from backend API
3. User selects a plan and accepts terms
4. User clicks "Continue to Payment"
5. Stripe card input form appears
6. User enters card details and submits
7. Payment is processed through backend
8. Success/error feedback is displayed

### Plan Data Structure
The API returns plans in this format:
```json
{
  "success": true,
  "data": [
    {
      "priceId": "price_1234567890",
      "amount": 9.99,
      "currency": "usd",
      "interval": "month",
      "productId": "prod_1234567890",
      "productName": "Monthly Plan"
    }
  ]
}
```

## Error Handling
- API connection errors show user-friendly messages
- Stripe payment errors are displayed to the user
- Loading states prevent double submissions
- Form validation ensures plan selection and terms acceptance

## Security
- No sensitive Stripe keys in frontend code
- Payment processing handled by backend
- User authentication required through OnboardingContext
- Stripe Elements handles secure card data collection

## Testing
1. Start the backend server on port 5010
2. Ensure subscription plans exist in your Stripe dashboard
3. Use Stripe test cards for testing:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`

## Notes
- The integration preserves all existing onboarding flows
- No other pages or components were modified
- Users must be authenticated (have userInfoId) to purchase subscriptions
- Environment variables must be set for proper API communication
