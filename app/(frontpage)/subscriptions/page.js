"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Elements,
  CardElement,
  PaymentRequestButtonElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { apiService } from "../../../lib/api";
import { useOnboarding } from "../../../context/OnboardingContext";
import { stripePromise } from "../../../lib/stripe";

// Stripe Payment Form Component
function StripePaymentForm({
  selectedPlan,
  onSuccess,
  onError,
  userInfoId,
  userInfo,
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [paymentRequest, setPaymentRequest] = useState(null);

  // Setup Apple Pay / Google Pay
  useEffect(() => {
    if (!stripe || !selectedPlan) {
      return;
    }

    const pr = stripe.paymentRequest({
      country: 'US',
      currency: 'usd',
      total: {
        label: selectedPlan?.productName || `${selectedPlan?.interval === "month" ? "Monthly" : "Yearly"} Plan`,
        amount: Math.round((selectedPlan?.amount || selectedPlan?.price) * 100), // Convert to cents
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    // Check if Apple Pay / Google Pay is available
    pr.canMakePayment().then(result => {
      if (result) {
        console.log("✅ Apple Pay / Google Pay is available");
        setPaymentRequest(pr);
      } else {
        console.log("❌ Apple Pay / Google Pay is not available");
      }
    });

    // Handle payment method creation from Apple Pay / Google Pay
    pr.on('paymentmethod', async (e) => {
      console.log("🍎 Apple Pay / Google Pay payment method received");
      await processPayment(e.paymentMethod.id, e);
    });

  }, [stripe, selectedPlan]);

  const processPayment = async (paymentMethodId, event = null) => {
    console.log("🚀 Processing payment with method:", paymentMethodId);
    
    try {
      // Call backend to create subscription
      console.log("🔄 Calling backend to create subscription...");
      const result = await apiService.purchaseSubscription(
        selectedPlan.priceId,
        {
          paymentMethodId: paymentMethodId,
          userInfoId: userInfoId,
        }
      );

      console.log("📨 Backend response received:", result);

      if (result.success) {
        const subscription = result.result;
        console.log("✅ Subscription created successfully");

        const paymentIntentStatus =
          subscription.latest_invoice?.payment_intent?.status;

        console.log("💳 Payment Intent Status:", paymentIntentStatus);

        if (paymentIntentStatus === "requires_action") {
          console.log("🔐 Payment requires additional authentication");
          const clientSecret =
            subscription.latest_invoice.payment_intent.client_secret;

          const { error: confirmError } = await stripe.confirmCardPayment(
            clientSecret
          );

          if (confirmError) {
            console.error("❌ Authentication failed:", confirmError);
            if (event) event.complete('fail');
            onError(confirmError.message);
          } else {
            console.log("✅ Authentication successful");
            if (event) event.complete('success');
            onSuccess(result);
          }
        } else if (paymentIntentStatus === "succeeded") {
          console.log("✅ Payment succeeded");
          if (event) event.complete('success');
          onSuccess(result);
        } else if (paymentIntentStatus === "requires_payment_method") {
          console.error("❌ Payment method was declined");
          if (event) event.complete('fail');
          onError("Payment method was declined. Please try a different card.");
        } else {
          console.error("❌ Unexpected payment status:", paymentIntentStatus);
          if (event) event.complete('fail');
          onError(`Payment was not successful. Status: ${paymentIntentStatus}`);
        }
      } else {
        console.error("❌ Subscription creation failed:", result.message);
        if (event) event.complete('fail');
        onError(result.message || "Subscription creation failed");
      }
    } catch (err) {
      console.error("💥 Payment error:", err);
      if (event) event.complete('fail');
      onError(err.message || "An unexpected error occurred during payment");
    }
  };

  const handlePayment = async (event) => {
    event.preventDefault();
    console.log("🚀 Payment process started");

    // Validation checks
    if (!stripe) {
      console.error("❌ Stripe not loaded");
      onError("Payment system not ready - Stripe not loaded");
      return;
    }

    if (!elements) {
      console.error("❌ Elements not loaded");
      onError("Payment system not ready - Elements not loaded");
      return;
    }

    if (!selectedPlan) {
      console.error("❌ No plan selected");
      onError("No plan selected");
      return;
    }

    if (!userInfoId) {
      console.error("❌ User information missing");
      onError("User information is missing. Please complete registration again.");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      console.error("❌ Card element not found");
      onError("Card element not found - please refresh the page");
      return;
    }

    setLoading(true);

    try {
      // Create payment method
      console.log("🔄 Creating payment method...");
      const { error: paymentMethodError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
          billing_details: {
            name: userInfo?.name || "",
            email: userInfo?.email || "",
            phone: userInfo?.phone || "",
          },
        });

      if (paymentMethodError) {
        console.error("❌ Payment method creation failed:", paymentMethodError);
        onError(paymentMethodError.message);
        return;
      }

      console.log("✅ Payment method created successfully");
      await processPayment(paymentMethod.id);

    } catch (err) {
      console.error("💥 Payment error caught:", err);
      onError(err.message || "An unexpected error occurred during payment");
    } finally {
      console.log("🏁 Payment process finished");
      setLoading(false);
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="stripe-payment-form mt-3">
      {/* Plan Summary Box */}
      <div className="plan-summary-box mb-4">
        <div>
          <p className="mb-0" style={{ fontSize: "14px", opacity: "0.9" }}>
            3 days free trial, then
          </p>
          <h3 className="mb-0" style={{ fontWeight: "700" }}>
            {formatAmount(selectedPlan?.amount || selectedPlan?.price)}
            <span style={{ fontSize: "18px", fontWeight: "400" }}>
              /{selectedPlan?.interval}
            </span>
          </h3>
        </div>
      </div>

      {/* Apple Pay / Google Pay Button */}
      {paymentRequest && (
        <div className="mb-3">
          <PaymentRequestButtonElement 
            options={{
              paymentRequest,
              style: {
                paymentRequestButton: {
                  type: 'default',
                  theme: 'dark',
                  height: '48px',
                },
              },
            }}
          />
          <div className="text-center my-3">
            <span className="text-muted">or pay with card</span>
          </div>
        </div>
      )}

      <form onSubmit={handlePayment}>
        <div className="mb-3 text-start">
          <label className="form-label fw-semibold">Card Information</label>
          <div className="dv_card_info">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#424770",
                    "::placeholder": {
                      color: "#aab7c4",
                    },
                  },
                  invalid: {
                    color: "#9e2146",
                  },
                },
              }}
              onReady={(element) => {
                console.log("✅ CardElement is ready:", element);
              }}
              onChange={(event) => {
                console.log("💳 Card input changed:", {
                  complete: event.complete,
                  error: event.error?.message,
                  brand: event.brand,
                });
              }}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !stripe || !elements}
          className="custom-btn continue-btn"
          style={{
            fontSize: "16px",
            fontWeight: "600",
            border: "none",
            borderRadius: "8px",
          }}
        >
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Processing Payment...
            </>
          ) : (
            `Subscribe Now`
          )}
        </button>
        <button
          type="button"
          className="prev-link continue-btn mt-3"
          onClick={() => window.history.back()}
        >
          <span>Back to Plans</span>
        </button>
      </form>

      <div className="payment-info mt-4 text-center">
        <p className="small text-muted mt-2 mb-0">
          🔒 Your payment information is encrypted and secure
        </p>
      </div>
    </div>
  );
}

function SubscriptionPage() {
  const router = useRouter();
  const [storedUser, setStoredUser] = useState({});
  const { state, updateStep } = useOnboarding();
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const userInfoId = storedUser?.user?.userInfoId;

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = JSON.parse(
        window.localStorage.getItem("onboardingState") || "{}"
      );
      setStoredUser(user);
    }
  }, []);

  useEffect(() => {
    console.log("🏁 SubscriptionPage component mounted");
    console.log("📊 Current onboarding state:", state);

    fetchSubscriptionPlans();
  }, [state.currentStep, updateStep]);

  useEffect(() => {
    updateStep(32);
  }, []);

  useEffect(() => {
    fetchSubscriptionPlans();
  }, []);

  const fetchSubscriptionPlans = async () => {
    console.log("🔄 Fetching subscription plans...");
    try {
      setLoading(true);
      const response = await apiService.getSubscriptionPlans();
      console.log("📨 Subscription plans response:", response);

      if (response.success && response.result) {
        console.log("✅ Plans loaded successfully:", response.result);
        setPlans(response.result);

        if (response.result.length > 0) {
          console.log("🎯 Auto-selecting first plan:", response.result[0]);
          setSelectedPlan(response.result[0]);
        }
      } else {
        console.error("❌ Failed to load subscription plans:", response);
        setError("Failed to load subscription plans");
      }
    } catch (err) {
      console.error("💥 Error fetching plans:", err);
      setError("Failed to load subscription plans");
    } finally {
      console.log("🏁 Plan fetching finished");
      setLoading(false);
    }
  };

  const handlePlanSelect = (plan) => {
    console.log("🎯 Plan selected:", plan);
    setSelectedPlan(plan);
    setError("");
  };

  const handlePurchase = () => {
    console.log("💰 Purchase button clicked");

    if (!selectedPlan) {
      console.error("❌ No plan selected");
      setError("Please select a plan");
      return;
    }
    if (!termsAccepted) {
      console.error("❌ Terms not accepted");
      setError("Please accept the terms and conditions");
      return;
    }

    if (!userInfoId) {
      console.error("❌ User information missing");
      setError("User information is missing. Please complete registration again.");
      setTimeout(() => {
        router.push("/register");
      }, 2000);
      return;
    }

    console.log("✅ All validations passed, proceeding to payment");
    setShowPayment(true);
  };

  const handlePaymentSuccess = async (result) => {
    console.log("🎉 Payment successful:", result);
    setShowPayment(false);
    setError("");

    try {
      const userData = state.user || {};
      if (userData.email && userInfoId) {
        console.log("🔄 Calling social-login API after payment completion");

        const socialLoginPayload = {
          email: userData.email,
          username: userData.username || userData.email.split("@")[0],
          platform: userData.platform || "web",
          userInfoId: userInfoId,
        };

        console.log("📤 Social login payload:", socialLoginPayload);
        const socialLoginResponse = await apiService.socialLogin(socialLoginPayload);

        if (socialLoginResponse.success) {
          console.log("✅ Social login API called successfully");
        } else {
          console.error("❌ Social login API failed:", socialLoginResponse.message);
        }
      }
    } catch (error) {
      console.error("💥 Error calling social-login API:", error);
    }

    console.log("⏰ Setting redirect timer");
    setTimeout(() => {
      console.log("🔄 Redirecting to download page");
      setSuccess("");
      router.push("/download-app");
    }, 0);
  };

  const handlePaymentError = (errorMessage) => {
    console.error("💥 Payment failed:", errorMessage);
    setError(errorMessage);
    setShowPayment(false);
    setSuccess("");
  };

  if (loading) {
    return (
      <section className="auth-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading subscription plans...</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="auth-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="auth-logo text-center">
                <Link href="/">
                  <img src="/images/dark-logo.svg" alt="Logo" />
                </Link>
              </div>
              <div className="auth-cards">
                {!showPayment && (
                  <button
                    type="button"
                    onClick={() => router.back(-2)}
                    className="new_back_btn"
                  >
                    Previous
                  </button>
                )}

                {showPayment && (
                  <button
                    type="button"
                    onClick={() => setShowPayment(false)}
                    className="new_back_btn"
                  >
                    Previous
                  </button>
                )}

                <p className="text-uppercase mb-2">Subscriptions</p>
                {!showPayment && (
                  <h3 className="mb-2">
                    Unlock Your Personalized <br /> Fitness Plan
                  </h3>
                )}
                {!showPayment && (
                  <p>
                    Get full access to your custom Meal and Workout <br /> Plans
                    by subscribing to Trom.
                  </p>
                )}

                {error && (
                  <div className="alert alert-danger" role="alert">
                    <strong>Error:</strong> {error}
                  </div>
                )}

                {success && (
                  <div className="alert alert-success" role="alert">
                    <strong>Success:</strong> {success}
                  </div>
                )}

                <div className="choose-plan px-135">
                  {!showPayment && (
                    <h6 className="text-center">Choose a plan to begin:</h6>
                  )}
                  {!showPayment && (
                    <div className="choose-plan-list">
                      {plans.length > 0 ? (
                        plans.map((plan) => (
                          <div
                            key={plan.priceId}
                            className="form-check choose-plan-bx"
                          >
                            <input
                              className="form-check-input"
                              type="radio"
                              name="plan"
                              id={plan.priceId}
                              checked={selectedPlan?.priceId === plan.priceId}
                              onChange={() => handlePlanSelect(plan)}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={plan.priceId}
                            >
                              <div>
                                <strong>
                                  {plan.productName ||
                                    `${plan.interval === "month"
                                      ? "Monthly"
                                      : "Yearly"
                                    } Plan`}
                                </strong>
                                <p>
                                  3 days free, then ${plan.amount || plan.price}
                                  /{plan.interval}
                                </p>
                              </div>
                            </label>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-muted">
                            No subscription plans available
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  {!showPayment && (
                    <div className="form-check choose-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="checkDefault"
                        checked={termsAccepted}
                        onChange={(e) => {
                          console.log("📜 Terms acceptance changed:", e.target.checked);
                          setTermsAccepted(e.target.checked);
                        }}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="checkDefault"
                      >
                        I agree to the app's{" "}
                        <Link href="/privacy-policy">Privacy Policy</Link> and{" "}
                        <Link href="/terms-and-conditions">
                          Terms & Conditions
                        </Link>
                      </label>
                    </div>
                  )}

                  <div className="text-center mt-3">
                    {!showPayment ? (
                      <button
                        className="custom-btn continue-btn"
                        onClick={handlePurchase}
                        disabled={!selectedPlan || !termsAccepted}
                        title={
                          !userInfoId
                            ? "User information missing - please complete registration"
                            : ""
                        }
                      >
                        Pay
                      </button>
                    ) : (
                      <Elements
                        stripe={stripePromise}
                        options={{
                          appearance: {
                            theme: "stripe",
                          },
                        }}
                      >
                        <div>
                          <h3>{selectedPlan.title}</h3>

                          <StripePaymentForm
                            selectedPlan={selectedPlan}
                            onSuccess={handlePaymentSuccess}
                            onError={handlePaymentError}
                            userInfoId={userInfoId || state.user?.userInfoId}
                            userInfo={state.user}
                          />
                        </div>
                      </Elements>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="auth-bttm">
            <p>
              <span>{state.currentStep}/</span> {state.totalSteps}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default SubscriptionPage;