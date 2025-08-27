# Razorpay Integration Guide

This document explains the Razorpay payment integration implemented in the TROMS subscription system.

## Overview

The subscription page now uses Razorpay for payment processing while maintaining compatibility with the existing Stripe backend API. This hybrid approach provides a better payment experience in the Indian market without requiring major backend changes.

## Features

### ✅ Implemented
- Clean, modern payment UI
- Support for UPI, Cards, Net Banking & Wallets
- Payment summary display
- Real-time payment processing
- Error handling with user-friendly messages
- Payment verification
- Back button to return to plan selection
- Secure payment flow

### 🔧 Payment Flow
1. User selects a subscription plan
2. User accepts terms and conditions
3. User clicks "Continue to Payment"
4. Payment summary is displayed
5. User clicks "Pay [Amount] - Subscribe Now"
6. Razorpay checkout modal opens
7. User completes payment
8. Payment is verified on backend
9. Success/error message is displayed

## Files Modified

### Frontend Files
- `app/(frontpage)/subscriptions/page.jsx` - Main subscription page with Razorpay integration
- `lib/razorpay.js` - Razorpay utility functions
- `lib/api.js` - Added Razorpay API endpoints
- `env.example` - Added Razorpay configuration

### New Dependencies
- `razorpay` - Razorpay SDK for Node.js

## Configuration

### Environment Variables
Add these to your `.env.local` file:

```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id_here
```

### Backend Requirements
The implementation uses existing Stripe API endpoints with enhanced support for Razorpay payment data:

1. **Existing endpoint**: `POST /stripeWEB/purchase-subscription/{priceId}`
   - Now accepts both Stripe and Razorpay payment data
   - Razorpay Input: `{ paymentMethodId: "pm_razorpay_xxx", userInfoId, razorpayPaymentId, razorpayOrderId, razorpaySignature }`
   - Output: `{ success, message, data }`

2. **Existing endpoint**: `GET /stripeWEB/get-subscription-plans`
   - No changes required - continues to work as before

See `BACKEND_INTEGRATION_GUIDE.md` for detailed implementation instructions.

## UI Improvements

### Payment Summary
- Displays plan name, amount, and billing frequency
- Clean, card-like design with proper spacing
- Clear visual hierarchy

### Payment Button
- Large, prominent call-to-action
- Loading state with spinner
- Clear pricing information
- Professional styling

### User Experience
- Back button to return to plan selection
- Error messages for failed payments
- Success confirmation
- Secure payment indicators

### Security Features
- Payment signature verification
- Server-side validation
- Secure order creation
- Protected API endpoints

## Testing

To test the integration:

1. Set up Razorpay test credentials
2. Configure environment variables
3. Implement backend endpoints
4. Start the development server
5. Navigate to the subscriptions page
6. Select a plan and test payment flow

## Production Deployment

1. Replace test keys with live Razorpay keys
2. Update API base URL to production
3. Ensure all backend endpoints are deployed
4. Test with real payment methods
5. Monitor payment success/failure rates

## Support

For Razorpay-specific issues:
- Check Razorpay dashboard for payment logs
- Use Razorpay test cards for development
- Implement webhook for payment status updates
- Add proper error logging
