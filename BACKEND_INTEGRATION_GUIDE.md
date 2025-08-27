# Backend Integration Guide for Razorpay with Existing Stripe API

This guide explains how to modify your existing Stripe backend to support Razorpay payments while maintaining compatibility with the current API structure.

## Overview

The frontend now uses Razorpay for payment processing but sends the payment data to your existing Stripe API endpoints. This hybrid approach allows you to:

1. Keep your existing subscription logic
2. Use Razorpay for better Indian market support
3. Maintain database consistency
4. Minimal backend changes required

## Required Backend Modifications

### 1. Update Stripe Controller (`stripe.controller.ts`)

Modify the `purchaseSubscription` method to handle Razorpay payment data:

```typescript
const purchaseSubscription = catchAsync(async (req: Request, res: Response) => {
  const priceId = req.params.priceId as string;
  const { 
    paymentMethodId, 
    userInfoId,
    razorpayPaymentId,
    razorpayOrderId,
    razorpaySignature 
  } = req.body;
  
  // Check if this is a Razorpay payment
  if (razorpayPaymentId && paymentMethodId.startsWith('pm_razorpay_')) {
    // Handle Razorpay payment
    const result = await stripeService.purchaseSubscriptionWithRazorpay(
      priceId,
      {
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature,
        userInfoId,
        paymentMethodId
      }
    );
    
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Subscription created successfully with Razorpay",
      data: result,
    });
    return;
  }
  
  // Original Stripe logic
  const customerId = req?.user?.stripeCustomerId as string;
  const result = await stripeService.purchaseSubscriptionIntoDB(
    priceId,
    paymentMethodId,
    customerId,
    userInfoId
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Subscription created successfully",
    data: result,
  });
});
```

### 2. Update Stripe Service (`stripe.service.ts`)

Add a new method to handle Razorpay payments:

```typescript
const purchaseSubscriptionWithRazorpay = async (
  priceId: string,
  razorpayData: {
    razorpayPaymentId: string;
    razorpayOrderId: string;
    razorpaySignature: string;
    userInfoId: string;
    paymentMethodId: string;
  }
) => {
  const { razorpayPaymentId, userInfoId, paymentMethodId } = razorpayData;
  
  // Check for existing subscription
  const existingSubscription = await prisma.userSubscription.findUnique({
    where: {
      userId_priceId: { userId: userInfoId, priceId },
      status: PaymentStatus.ACTIVE,
    },
  });

  if (existingSubscription) {
    throw new ApiError(
      400,
      "User already has an active subscription for this plan."
    );
  }

  // Get plan details from Stripe
  const plan = await stripe.prices.retrieve(priceId);
  
  // Create subscription record in database
  const subscription = await prisma.userSubscription.create({
    data: {
      userId: userInfoId,
      priceId: priceId,
      status: PaymentStatus.ACTIVE,
      paymentMethodId: paymentMethodId,
      razorpayPaymentId: razorpayPaymentId, // Store Razorpay payment ID
      subscriptionId: `sub_razorpay_${Date.now()}`, // Generate subscription ID
      startDate: new Date(),
      // Add other required fields based on your schema
    },
  });

  // Handle promo code if exists
  const usePromoCode = await prisma.usePromoCode.findUnique({
    where: {
      userInfoId: userInfoId,
      isUsed: false,
    },
  });

  if (usePromoCode) {
    await prisma.usePromoCode.update({
      where: { id: usePromoCode.id },
      data: { isUsed: true },
    });
  }

  return {
    subscription,
    paymentId: razorpayPaymentId,
    status: 'completed'
  };
};
```

### 3. Update Database Schema (if needed)

Add fields to store Razorpay payment information:

```sql
-- Add these columns to your subscription table if not present
ALTER TABLE user_subscriptions 
ADD COLUMN razorpay_payment_id VARCHAR(255),
ADD COLUMN razorpay_order_id VARCHAR(255),
ADD COLUMN razorpay_signature VARCHAR(255);

-- Index for faster lookups
CREATE INDEX idx_razorpay_payment_id ON user_subscriptions(razorpay_payment_id);
```

### 4. Environment Variables

Add Razorpay configuration to your backend `.env`:

```env
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### 5. Optional: Razorpay Verification

For enhanced security, add Razorpay signature verification:

```typescript
import crypto from 'crypto';

const verifyRazorpaySignature = (
  orderId: string,
  paymentId: string,
  signature: string
): boolean => {
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(orderId + '|' + paymentId)
    .digest('hex');
  
  return expectedSignature === signature;
};
```

## Frontend Changes Made

The frontend now:

1. Uses Razorpay payment UI instead of Stripe
2. Sends payment data to existing `/stripeWEB/purchase-subscription/:priceId` endpoint
3. Maintains compatibility with existing API structure
4. Provides better payment experience for Indian users

## API Endpoint Structure

The existing endpoint `/stripeWEB/purchase-subscription/:priceId` now accepts:

**Original Stripe Format:**
```json
{
  "paymentMethodId": "pm_stripe_xxxxx",
  "userInfoId": "user_123"
}
```

**New Razorpay Format:**
```json
{
  "paymentMethodId": "pm_razorpay_xxxxx",
  "userInfoId": "user_123",
  "razorpayPaymentId": "pay_xxxxx",
  "razorpayOrderId": "order_xxxxx", 
  "razorpaySignature": "signature_xxxxx"
}
```

## Benefits

1. **No API Breaking Changes**: Existing Stripe integration continues to work
2. **Dual Payment Support**: Can support both Stripe and Razorpay
3. **Minimal Backend Changes**: Only controller and service modifications needed
4. **Better UX**: Razorpay provides better payment experience in India
5. **Database Consistency**: Same subscription management logic

## Testing

1. Test with Razorpay test credentials
2. Verify subscription creation in database
3. Test both Stripe and Razorpay payment flows
4. Ensure existing API endpoints remain functional

## Deployment Checklist

- [ ] Add Razorpay credentials to environment variables
- [ ] Update database schema if needed
- [ ] Deploy backend changes
- [ ] Test payment flows
- [ ] Monitor for any issues

This hybrid approach allows you to gradually migrate to Razorpay while maintaining backward compatibility with your existing Stripe infrastructure.
