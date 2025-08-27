const BASE_URL = "http://localhost:5010/api/v1";
// process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5010/api/v1";

class ApiService {
  constructor() {
    this.baseURL = BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body !== "string") {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      // if (!response.ok) {
      //   throw new Error(data.message || 'API request failed');
      // }

      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  // Auth APIs
  async socialLogin(payload) {
    // Ensure required fields are present
    const requiredPayload = {
      email: payload.email,
      username: payload.username,
      platform: payload.platform,
      ...(payload.userInfoId && { userInfoId: payload.userInfoId }),
    };

    return this.request("/auth/social-login", {
      method: "POST",
      body: requiredPayload,
    });
  }

  async createUserInfo(payload) {
    return this.request("/users/create-user-info", {
      method: "POST",
      body: payload,
    });
  }

  // Equipment APIs
  async getEquipments() {
    return this.request("/workout/accesible-equipments");
  }

  // Food APIs
  async getCheatMeals() {
    return this.request("/food/cheat-meals-list");
  }

  async getAllergicFoodItems() {
    return this.request("/food/allergic-food-items-list");
  }

  async getDislikedFoodItems() {
    return this.request("/food/disliked-food-items-list");
  }

  // Injuries API
  async getInjuries() {
    return this.request("/workout/get-injuries-from-db");
  }
  //privacy-policy
  async privacyPolicy() {
    return this.request("/admin/privacy-policy");
  }

  //termsAndConditions
  async termsandconditions() {
    return this.request("/admin/terms-and-conditions");
  }

  // Subscription APIs
  async getSubscriptionPlans() {
    return this.request("/stripeWEB/get-subscription-plans");
  }

  async purchaseSubscription(priceId, paymentData) {
    console.log("paymentData", paymentData);
    return this.request(`/stripeWEB/purchase-subscription/${priceId}`, {
      method: "POST",
      body: paymentData,
    });
  }

  // Razorpay APIs - Using existing Stripe endpoints with Razorpay payment data
  async createRazorpayPaymentMethod(paymentData) {
    // Simulate payment method creation for compatibility with existing backend
    return {
      success: true,
      paymentMethod: {
        id: `pm_razorpay_${Date.now()}`, // Simulated payment method ID
        type: "card",
        ...paymentData,
      },
    };
  }

  async purchaseSubscriptionWithRazorpay(priceId, razorpayData) {
    // Use existing Stripe endpoint but with Razorpay payment data
    const paymentMethodData = {
      paymentMethodId: `pm_razorpay_${razorpayData.razorpay_payment_id}`,
      userInfoId: razorpayData.userInfoId,
      razorpayPaymentId: razorpayData.razorpay_payment_id,
      razorpayOrderId: razorpayData.razorpay_order_id,
      razorpaySignature: razorpayData.razorpay_signature,
    };

    return this.request(`/stripeWEB/purchase-subscription/${priceId}`, {
      method: "POST",
      body: paymentMethodData,
    });
  }
}

export const apiService = new ApiService();
export { BASE_URL };
