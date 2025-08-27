import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
// Replace with your actual Stripe publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_...');

export { stripePromise };

// Stripe utilities
export const createPaymentMethod = async (stripe, card, billingDetails = {}) => {
  const { error, paymentMethod } = await stripe.createPaymentMethod({
    type: 'card',
    card: card,
    billing_details: billingDetails,
  });

  if (error) {
    throw new Error(error.message);
  }

  return paymentMethod;
};

// Format amount for display
export const formatAmount = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// Convert dollar amount to cents
export const convertToCents = (amount) => {
  return Math.round(amount * 100);
};

// Convert cents to dollar amount
export const convertToDollars = (cents) => {
  return cents / 100;
};

// Create Stripe payment intent
export const createPaymentIntent = async (stripe, amount, currency = 'usd') => {
  const { error, paymentIntent } = await stripe.createPaymentIntent({
    amount: convertToCents(amount),
    currency: currency,
  });

  if (error) {
    throw new Error(error.message);
  }

  return paymentIntent;
};

// Confirm card payment
export const confirmCardPayment = async (stripe, clientSecret, paymentMethod) => {
  const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
    payment_method: paymentMethod,
  });

  if (error) {
    throw new Error(error.message);
  }

  return paymentIntent;
};

// Stripe configuration constants
export const STRIPE_CONFIG = {
  appearance: {
    theme: 'stripe',
    variables: {
      colorPrimary: '#007bff',
      colorBackground: '#ffffff',
      colorText: '#424770',
      colorDanger: '#df1b41',
      fontFamily: 'Ideal Sans, system-ui, sans-serif',
      spacingUnit: '2px',
      borderRadius: '4px',
    },
  },
  cardStyle: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};