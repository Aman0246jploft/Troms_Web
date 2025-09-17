"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

    // Check if userInfoId exists before processing payment
    if (!userInfoId) {
      console.error("❌ User information missing - userInfoId required for payment");
      onError("User information is missing. Please complete registration again.");
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
      <form onSubmit={handlePayment}>
        <div className="mb-3">
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
            `Subscribe for ${formatAmount(
              selectedPlan?.amount || selectedPlan?.price
            )}/${selectedPlan?.interval}`
          )}
        </button>
      </form>

      <div className="payment-info mt-4 text-center">
        <p className="small text-muted mt-2 mb-0">
          Your payment information is encrypted and secure
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
    if (state.currentStep !== 31) {
      updateStep(31);
    }
  }, [state.currentStep, updateStep]); 

  useEffect(() => {

  fetchSubscriptionPlans();
}, []); // <- empty array, runs once


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
    console.log("👤 User Info ID:", userInfoId);

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
    
    // Check if userInfoId exists before proceeding to payment
    if (!userInfoId) {
      console.error("❌ User information missing - userInfoId not found");
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
    // setSuccess("Subscription successful! Welcome to TROMS Fitness");
    setShowPayment(false);
    setError("");

    // Call social-login API again with userInfoId after successful payment
    try {
      const userData = state.user || {};
      if (userData.email && userInfoId) {
        console.log(
          "🔄 Calling social-login API after payment completion with userInfoId:",
          userInfoId
        );

        const socialLoginPayload = {
          email: userData.email,
          username: userData.username || userData.email.split("@")[0],
          platform: userData.platform || "web",
          userInfoId: userInfoId,
        };

        console.log("socialLoginPayload", socialLoginPayload);

        console.log(
          "📤 Social login payload after payment:",
          socialLoginPayload
        );
        const socialLoginResponse = await apiService.socialLogin(
          socialLoginPayload
        );

        if (socialLoginResponse.success) {
          console.log(
            "✅ Social login API called successfully after payment:",
            socialLoginResponse
          );
        } else {
          console.error(
            "❌ Social login API failed after payment:",
            socialLoginResponse.message
          );
        }
      } else {
        console.warn(
          "⚠️ Missing user data or userInfoId for social login call after payment"
        );
        console.log("User data:", userData);
        console.log("UserInfoId:", userInfoId);
      }
    } catch (error) {
      console.error("💥 Error calling social-login API after payment:", error);
      // Don't show error to user as payment was successful, just log it
    }

    // Redirect to home page after 2 seconds and clear success message
    console.log("⏰ Setting redirect timer (2 seconds)");
    setTimeout(() => {
      console.log("🔄 Redirecting to home page...");
      setSuccess(""); // Clear success message
      router.push("/download-app"); // Redirect to home page
    }, 1000);
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
                  <h6 className="text-center">Choose a plan to begin:</h6>
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
                                  `${
                                    plan.interval === "month"
                                      ? "Monthly"
                                      : "Yearly"
                                  } Plan`}
                              </strong>
                              <p>
                                3 days free, then ${plan.amount || plan.price}/
                                {plan.interval}
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

                  <div className="text-center mt-3">
                    {!showPayment ? (
                      <button
                        className="custom-btn continue-btn"
                        onClick={handlePurchase}
                        disabled={!selectedPlan || !termsAccepted }
                        title={!userInfoId ? "User information missing - please complete registration" : ""}
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
                          {/* <button
                            className="btn btn-outline-secondary mb-4"
                            onClick={handleBackToPlans}
                            style={{
                              borderRadius: "8px",
                              padding: "8px 16px",
                            }}
                          >
                            ← Back to Plans
                          </button> */}
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
            {/* <p>
              <span>25/</span> 25
            </p> */}
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
