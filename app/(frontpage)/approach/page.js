"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "../../../context/OnboardingContext";
import Alert from "../../../Components/Alert";

function ApproachPage() {
  const router = useRouter();
  const { state, updateStep } = useOnboarding();
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // Redirect if not authenticated
    if (state.isAuthChecked && state.isAuthenticated === false) {
      router.push("/register");
      return;
    }

    // Check if all required fields are filled
    const requiredFields = [
      "gender",
      "dateOfBirth",
      "age",
      "trainingDays",
      "weight",
      "weightGoal",
      "desiredWeight",
      "workoutLocation",
      "selectedEquipments",
      "reachingGoals",
      "accomplish",
      "dietType",
      "cheatMealFoodItems",
      "cookingLevel",
      "allergicFoodItems",
      "dislikedFoodItems",
      "injuries",
    ];

    const missingFields = requiredFields.filter((field) => {
      const value = state[field];
      if (Array.isArray(value)) return value.length === 0;
      return !value || value === "";
    });

    if (missingFields.length > 0) {
      console.log("Missing fields:", missingFields);
      showAlert(
        "warning",
        "Please complete all previous steps before proceeding."
      );
      return;
    }

    // ✅ Only update step if not already set
    if (state.currentStep !== 23) {
      updateStep(23);
    }
  }, [state.isAuthChecked, state.isAuthenticated, state.currentStep]);

  useEffect(() => {
    if (state.currentStep === 23 && !isCompleted && !isProcessing) {
      startProcessing();
    }
  }, [state.currentStep, isCompleted, isProcessing]);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
  };

  const hideAlert = () => {
    setAlert({ show: false, type: "", message: "" });
  };

  const startProcessing = () => {
    setIsProcessing(true);
    hideAlert();

    // Simulate processing time (3 seconds)
    setTimeout(() => {
      setIsCompleted(true);
      setIsProcessing(false);
      
      // Auto-redirect to BMR page after completion
      setTimeout(() => {
        router.push("/bmr");
      }, 2000);
    }, 3000);
  };

  const handleContinue = () => {
    if (isCompleted) {
      updateStep(24);
      router.push("/bmr");
    } else if (!isProcessing) {
      startProcessing();
    }
  };

  return (
    <>
      <section className="auth-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-7">
              <div className="auth-logo text-center">
                <Link href="/">
                  <img src="/images/dark-logo.svg" alt="Logo" />
                </Link>
              </div>

              <Alert
                type={alert.type}
                message={alert.message}
                show={alert.show}
                onClose={hideAlert}
              />

              <div className="auth-cards food">
                <p className="text-uppercase mb-5">Approach</p>

                <div className="text-center mt-3 mb-3">
                  {isCompleted ? (
                    <img src="/images/check-mark.svg" alt="Success" />
                  ) : (
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  )}
                </div>

                {isProcessing && !isCompleted ? (
                  <div className="text-center">
                    <h3 className="mb-4">Processing Your Information...</h3>
                    <p>
                      Please wait while we prepare your personalized fitness
                      profile.
                    </p>
                  </div>
                ) : isCompleted ? (
                  <div className="text-center">
                    <h3 className="mb-4">Thank you for your approach!</h3>
                    <p>
                      We promise to always keep your personal <br />{" "}
                      information's private and secure
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <h3 className="mb-4">Ready to Process...</h3>
                    <p>
                      Click continue to start processing your personalized fitness
                      profile.
                    </p>
                  </div>
                )}

                <div className="text-center mt-3">
                  <button
                    onClick={handleContinue}
                    className="custom-btn continue-btn"
                    disabled={isProcessing}
                  >
                    {isProcessing
                      ? "Processing..."
                      : "Continue"}
                  </button>
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
      </section>
    </>
  );
}

export default ApproachPage;
