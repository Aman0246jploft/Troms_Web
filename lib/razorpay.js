// Razorpay utility functions for payment processing

/**
 * Initialize Razorpay checkout - Simplified version
 * @param {Object} options - Razorpay checkout options
 * @param {Function} onSuccess - Success callback
 * @param {Function} onError - Error callback
 */
export const initializeRazorpayCheckout = (options, onSuccess, onError) => {
  // Load Razorpay script if not already loaded
  if (!window.Razorpay) {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      createRazorpayInstance(options, onSuccess, onError);
    };
    script.onerror = () => {
      onError('Failed to load Razorpay SDK');
    };
    document.body.appendChild(script);
  } else {
    createRazorpayInstance(options, onSuccess, onError);
  }
};

/**
 * Create Razorpay instance and open checkout - Simplified for direct payment
 */
const createRazorpayInstance = (options, onSuccess, onError) => {
  const razorpayOptions = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_...',
    amount: options.amount, // Amount in paisa
    currency: options.currency || 'INR',
    name: options.name || 'TROMS Fitness',
    description: options.description || 'Subscription Payment',
    image: options.image || '/images/dark-logo.svg',
    handler: function (response) {
      // Payment successful - simulate order_id for compatibility
      onSuccess({
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: `order_${Date.now()}`, // Simulated order ID
        razorpay_signature: response.razorpay_signature || `sig_${Date.now()}`,
      });
    },
    prefill: {
      name: options.prefill?.name || '',
      email: options.prefill?.email || '',
      contact: options.prefill?.contact || '',
    },
    notes: options.notes || {},
    theme: {
      color: options.theme?.color || '#007bff',
    },
    modal: {
      ondismiss: function () {
        onError('Payment cancelled by user');
      },
    },
  };

  const rzp = new window.Razorpay(razorpayOptions);
  
  rzp.on('payment.failed', function (response) {
    onError(response.error.description || 'Payment failed');
  });

  rzp.open();
};

/**
 * Verify payment signature (client-side verification for UI feedback)
 * Note: Always verify on server-side for security
 */
export const verifyPaymentSignature = (razorpayOrderId, razorpayPaymentId, signature) => {
  // This is just for client-side validation
  // Always verify on server-side using Razorpay webhook or API
  const crypto = require('crypto');
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(razorpayOrderId + '|' + razorpayPaymentId)
    .digest('hex');
  
  return expectedSignature === signature;
};

/**
 * Format amount for display
 */
export const formatAmount = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

/**
 * Convert amount to paisa (Razorpay uses paisa for INR)
 */
export const convertToPaisa = (amount) => {
  return Math.round(amount * 100);
};

/**
 * Convert paisa to rupees
 */
export const convertToRupees = (paisa) => {
  return paisa / 100;
};
