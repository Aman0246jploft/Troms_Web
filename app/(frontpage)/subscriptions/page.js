"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import {
  Elements,
  CardElement,
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

  const handlePayment = async (event) => {
    event.preventDefault();
    console.log("🚀 Payment process started");
    console.log("📋 Selected Plan:", selectedPlan);
    console.log("👤 User Info ID:", userInfoId);

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

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      console.error("❌ Card element not found");
      onError("Card element not found - please refresh the page");
      return;
    }

    console.log("✅ All validation checks passed");
    console.log("💳 Card element found:", cardElement);

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
        console.error("🔍 Error details:", {
          code: paymentMethodError.code,
          message: paymentMethodError.message,
          type: paymentMethodError.type,
        });
        onError(paymentMethodError.message);
        return;
      }

      console.log("✅ Payment method created successfully");
      console.log("💳 Payment Method ID:", paymentMethod.id);
      console.log("📄 Payment Method Details:", {
        id: paymentMethod.id,
        type: paymentMethod.type,
        card: paymentMethod.card,
      });

      // Call backend to create subscription
      console.log("🔄 Calling backend to create subscription...");
      console.log("📊 Subscription request data:", {
        priceId: selectedPlan.priceId,
        paymentMethodId: paymentMethod.id,
        userInfoId: userInfoId,
      });

      const result = await apiService.purchaseSubscription(
        selectedPlan.priceId,
        {
          paymentMethodId: paymentMethod.id,
          userInfoId: userInfoId,
        }
      );

      console.log("📨 Backend response received:", result);

      if (result.success) {
        const subscription = result.result;
        console.log("✅ Subscription created successfully");
        console.log("📋 Subscription details:", subscription);

        // Check if subscription requires further action (3D Secure, etc.)
        const paymentIntentStatus =
          subscription.latest_invoice?.payment_intent?.status;

        console.log("💳 Payment Intent Status:", paymentIntentStatus);
        console.log("🔍 Latest Invoice:", subscription.latest_invoice);

        if (paymentIntentStatus === "requires_action") {
          console.log(
            "🔐 Payment requires additional authentication (3D Secure)"
          );
          const clientSecret =
            subscription.latest_invoice.payment_intent.client_secret;
          console.log("🔑 Client Secret:", clientSecret ? "Found" : "Missing");

          const { error: confirmError } = await stripe.confirmCardPayment(
            clientSecret
          );

          if (confirmError) {
            console.error("❌ 3D Secure confirmation failed:", confirmError);
            console.error("🔍 Confirmation error details:", {
              code: confirmError.code,
              message: confirmError.message,
              type: confirmError.type,
            });
            onError(confirmError.message);
          } else {
            console.log("✅ 3D Secure confirmation successful");
            onSuccess(result);
          }
        } else if (paymentIntentStatus === "succeeded") {
          console.log("✅ Payment succeeded without additional authentication");
          onSuccess(result);
        } else if (paymentIntentStatus === "requires_payment_method") {
          console.error("❌ Payment method was declined");
          onError("Payment method was declined. Please try a different card.");
        } else {
          console.error("❌ Unexpected payment status:", paymentIntentStatus);
          onError(`Payment was not successful. Status: ${paymentIntentStatus}`);
        }
      } else {
        console.error("❌ Subscription creation failed:", result.message);
        console.error("🔍 Backend error details:", result);
        onError(result.message || "Subscription creation failed");
      }
    } catch (err) {
      console.error("💥 Payment error caught:", err);
      console.error("🔍 Error stack:", err.stack);
      console.error("🔍 Error details:", {
        name: err.name,
        message: err.message,
        code: err.code,
      });
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

  console.log("🎨 Rendering StripePaymentForm");
  console.log("⚡ Stripe ready:", !!stripe);
  console.log("🧩 Elements ready:", !!elements);

  return (
    <div className="stripe-payment-form mt-3">
      <div
        className="payment-summary mb-4 p-3"
        style={{
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
          border: "1px solid #e9ecef",
        }}
      >
        <h5 className="mb-3">Payment Summary</h5>
        <div className="d-flex justify-content-between mb-2">
          <span>Plan:</span>
          <span>
            {selectedPlan?.productName ||
              `${
                selectedPlan?.interval === "month" ? "Monthly" : "Yearly"
              } Plan`}
          </span>
        </div>
        <div className="d-flex justify-content-between mb-2">
          <span>Amount:</span>
          <span className="fw-bold">{formatAmount(selectedPlan?.amount)}</span>
        </div>
        <div className="d-flex justify-content-between">
          <span>Billing:</span>
          <span>{selectedPlan?.interval}ly</span>
        </div>
      </div>

      <form onSubmit={handlePayment}>
        <div className="mb-3">
          <label className="form-label fw-semibold">Card Information</label>
          <div
            style={{
              padding: "12px",
              border: "1px solid #ced4da",
              borderRadius: "4px",
              backgroundColor: "#fff",
            }}
          >
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
          className="btn btn-primary w-100 py-3"
          style={{
            fontSize: "16px",
            fontWeight: "600",
            background: "linear-gradient(135deg, #007bff 0%, #0056b3 100%)",
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
            `Subscribe for ${formatAmount(selectedPlan?.amount)}/${
              selectedPlan?.interval
            }`
          )}
        </button>
      </form>

      <div className="payment-info mt-4 text-center">
        <div className="d-flex justify-content-center align-items-center mb-2">
          <svg
            width="16"
            height="16"
            fill="currentColor"
            className="text-success me-2"
            viewBox="0 0 16 16"
          >
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
          </svg>
          <small className="text-muted">Secure payment powered by Stripe</small>
        </div>
        <div className="d-flex justify-content-center align-items-center flex-wrap gap-3">
          <img
            src="/images/visa.svg"
            alt="Visa"
            style={{ height: "20px" }}
            className="payment-method-icon"
          />
          <img
            src="/images/mastercard.svg"
            alt="Mastercard"
            style={{ height: "20px" }}
            className="payment-method-icon"
          />
          <img
            src="/images/amex.svg"
            alt="American Express"
            style={{ height: "20px" }}
            className="payment-method-icon"
          />
          <img
            src="/images/discover.svg"
            alt="Discover"
            style={{ height: "20px" }}
            className="payment-method-icon"
          />
        </div>
        <p className="small text-muted mt-2 mb-0">
          Your payment information is encrypted and secure
        </p>
      </div>
    </div>
  );
}

function SubscriptionPage() {
  const storedUser = JSON.parse(
    localStorage.getItem("onboardingState") || "{}"
  );
  const userInfoId = storedUser?.user?.userInfoId;
  const { state, updateStep } = useOnboarding();
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    console.log("🏁 SubscriptionPage component mounted");
    console.log("📊 Current onboarding state:", state);

    // Update current step
    if (state.currentStep !== 25) {
      console.log(`📈 Updating step from ${state.currentStep} to 25`);
      updateStep(25);
    }
    fetchSubscriptionPlans();
  }, [state.currentStep, updateStep]);

  const fetchSubscriptionPlans = async () => {
    console.log("🔄 Fetching subscription plans...");
    try {
      setLoading(true);
      const response = await apiService.getSubscriptionPlans();
      console.log("📨 Subscription plans response:", response);

      if (response.success && response.result) {
        console.log("✅ Plans loaded successfully:", response.result);
        setPlans(response.result);

        // Auto-select first plan if available
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
      console.error("🔍 Error details:", {
        name: err.name,
        message: err.message,
        stack: err.stack,
      });
      setError("Failed to load subscription plans");
    } finally {
      console.log("🏁 Plan fetching finished");
      setLoading(false);
    }
  };

  const handlePlanSelect = (plan) => {
    console.log("🎯 Plan selected:", plan);
    console.log("📋 Previous plan:", selectedPlan);
    setSelectedPlan(plan);
    setError("");
  };

  const handlePurchase = () => {
    console.log("💰 Purchase button clicked");
    console.log("📋 Selected plan:", selectedPlan);
    console.log("📜 Terms accepted:", termsAccepted);

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

    console.log("✅ Proceeding to payment");
    setShowPayment(true);
  };

  const handlePaymentSuccess = (result) => {
    console.log("🎉 Payment successful:", result);
    setSuccess("Subscription created successfully! Welcome to TROMS Fitness!");
    setShowPayment(false);
    setError("");

    // Redirect to dashboard or success page after delay
    console.log("⏰ Setting redirect timer (3 seconds)");
    // setTimeout(() => {
    //   console.log("🔄 Redirecting to dashboard...");
    //   window.location.href = "/dashboard";
    // }, 3000);
  };

  const handlePaymentError = (errorMessage) => {
    console.error("💥 Payment failed:", errorMessage);
    setError(errorMessage);
    setShowPayment(false);
    setSuccess("");
  };

  const handleBackToPlans = () => {
    console.log("⬅️ Back to plans clicked");
    setShowPayment(false);
    setError("");
  };

  console.log("🎨 Rendering SubscriptionPage");
  console.log("📊 Component state:", {
    loading,
    plansCount: plans.length,
    selectedPlan: selectedPlan?.priceId,
    showPayment,
    termsAccepted,
    error,
    success,
  });

  if (loading) {
    console.log("⏳ Showing loading state");
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
                <p className="text-uppercase mb-2">Subscriptions</p>
                <h3 className="mb-2">
                  Unlock Your Personalized <br /> Fitness Plan
                </h3>
                <p>
                  Get full access to your custom Meal and Workout <br /> Plans
                  by subscribing to Trom.
                </p>

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
                  {plans.length > 0 ? (
                    plans.map((plan) => (
                      <div
                        key={plan.priceId}
                        className={`form-check choose-plan-bx ${
                          selectedPlan?.priceId === plan.priceId
                            ? "selected"
                            : ""
                        }`}
                        style={{
                          border:
                            selectedPlan?.priceId === plan.priceId
                              ? "2px solid #007bff"
                              : "1px solid #dee2e6",
                          borderRadius: "8px",
                          transition: "all 0.3s ease",
                          marginBottom: "16px",
                          cursor: "pointer",
                        }}
                        onClick={() => handlePlanSelect(plan)}
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
                          style={{ cursor: "pointer" }}
                        >
                          <div>
                            <strong style={{ fontSize: "18px", color: "#333" }}>
                              {plan.productName ||
                                `${
                                  plan.interval === "month"
                                    ? "Monthly"
                                    : "Yearly"
                                } Plan`}
                            </strong>
                            <p
                              style={{
                                fontSize: "16px",
                                color: "#007bff",
                                fontWeight: "600",
                                margin: "8px 0",
                              }}
                            >
                              ${plan.amount}/{plan.interval}
                            </p>
                            {plan.interval === "year" && (
                              <p
                                style={{
                                  fontSize: "14px",
                                  color: "#28a745",
                                  margin: "4px 0",
                                }}
                              >
                                Save 20% with yearly billing
                              </p>
                            )}
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

                  <div className="form-check choose-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value=""
                      id="checkDefault"
                      checked={termsAccepted}
                      onChange={(e) => {
                        console.log(
                          "📜 Terms acceptance changed:",
                          e.target.checked
                        );
                        setTermsAccepted(e.target.checked);
                      }}
                    />
                    <label className="form-check-label" htmlFor="checkDefault">
                      I agree to the app's{" "}
                      <Link href="/privacy-policy">Privacy Policy</Link> and{" "}
                      <Link href="/terms-and-conditions">
                        Terms & Conditions
                      </Link>
                    </label>
                  </div>

                  <div className="text-center mt-4">
                    {!showPayment ? (
                      <button
                        className="custom-btn continue-btn"
                        onClick={handlePurchase}
                        disabled={!selectedPlan || !termsAccepted}
                        style={{
                          background:
                            selectedPlan && termsAccepted
                              ? "linear-gradient(135deg, #007bff 0%, #0056b3 100%)"
                              : "#6c757d",
                          border: "none",
                          borderRadius: "8px",
                          padding: "12px 24px",
                          fontSize: "16px",
                          fontWeight: "600",
                          transition: "all 0.3s ease",
                          cursor:
                            selectedPlan && termsAccepted
                              ? "pointer"
                              : "not-allowed",
                        }}
                      >
                        Continue to Payment
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
                          <button
                            className="btn btn-outline-secondary mb-4"
                            onClick={handleBackToPlans}
                            style={{
                              borderRadius: "8px",
                              padding: "8px 16px",
                            }}
                          >
                            ← Back to Plans
                          </button>
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
        </div>
      </section>
    </>
  );
}

export default SubscriptionPage;
