"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "../../../context/OnboardingContext";
import { apiService } from "../../../lib/api";
import Alert from "../../../Components/Alert";

function ApproachPage() {
  const router = useRouter();
  const {
    state,
    setLoading,
    setError,
    updateStep,
    updateField,
    getFinalPayload,
  } = useOnboarding();
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // Check for user data from localStorage if state is empty
    const checkUserData = () => {
      try {
        const savedState = localStorage.getItem("onboardingState");
        if (savedState) {
          const parsedState = JSON.parse(savedState);
          return parsedState.user || {};
        }
      } catch (error) {
        console.error("Error reading user data from localStorage:", error);
      }
      return {};
    };

    // Redirect if not authenticated
    if (state.isAuthChecked && state.isAuthenticated === false) {
      router.push("/register");
      return;
    }

    // Check if user email and username are present (from state or localStorage)
    const currentUser = state.user || {};
    const localStorageUser = checkUserData();
    
    const userEmail = currentUser.email || localStorageUser.email;
    const userUsername = currentUser.username || localStorageUser.username;

    if (!userEmail || !userUsername) {
      console.log("Missing user credentials - redirecting to register");
      showAlert(
        "error",
        "User information is missing. Please register again."
      );
      setTimeout(() => {
        router.push("/register");
      }, 2000);
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
        "error",
        "Required information is missing. Redirecting to registration to complete setup..."
      );
      setTimeout(() => {
        router.push("/register");
      }, 2000);
      return;
    }

    // ✅ Only update step if not already set
    if (state.currentStep !== 23) {
      updateStep(23);
    }
  }, [state.isAuthChecked, state.isAuthenticated, state.currentStep, state.user]);

  useEffect(() => {
    if (state.currentStep === 23 && !isCompleted && !isSubmitting) {
      handleSubmitUserInfo();
    }
  }, [state.currentStep, isCompleted, isSubmitting]);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
  };

  const hideAlert = () => {
    setAlert({ show: false, type: "", message: "" });
  };

  const handleSubmitUserInfo = async () => {
    setIsSubmitting(true);
    setLoading(true);
    hideAlert();

    try {
      // Double-check user credentials before submission
      const currentUser = state.user || {};
      if (!currentUser.email || !currentUser.username) {
        showAlert(
          "error",
          "User credentials are missing. Redirecting to registration..."
        );
        setTimeout(() => {
          router.push("/register");
        }, 2000);
        return;
      }

      const payload = getFinalPayload();
      console.log("Submitting user data:", payload);

      const response = await apiService.createUserInfo(payload);

      if (response.success) {
        setIsCompleted(true);
        // Mark onboarding as complete
        updateField("needsOnboarding", false);
        // showAlert('success', 'Your profile has been created successfully!');

        updateField("user", {
          ...state.user,
          userInfoId: response.result.id,
        });

        // Auto-redirect after success
        setTimeout(() => {
          router.push("/bmr");
        }, 2000);
      } else {
        // Check if error indicates authentication issues
        const errorMessage = response.message || "Failed to create profile. Please try again.";
        if (errorMessage.toLowerCase().includes("auth") || 
            errorMessage.toLowerCase().includes("user") || 
            errorMessage.toLowerCase().includes("credential")) {
          showAlert(
            "error",
            "Authentication failed. Please register again."
          );
          setTimeout(() => {
            router.push("/register");
          }, 2000);
        } else {
          showAlert("error", errorMessage);
        }
      }
    } catch (error) {
      console.error("User info submission error:", error);
      
      // Check if it's a network error or authentication error
      if (error.message && (error.message.includes("401") || error.message.includes("403"))) {
        showAlert(
          "error",
          "Authentication failed. Please register again."
        );
        setTimeout(() => {
          router.push("/register");
        }, 2000);
      } else {
        showAlert(
          "error",
          "Failed to create profile. Please check your internet connection and try again."
        );
      }
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const handleContinue = () => {
    // Verify user credentials before proceeding
    const currentUser = state.user || {};
    if (!currentUser.email || !currentUser.username) {
      showAlert(
        "error",
        "User credentials are missing. Redirecting to registration..."
      );
      setTimeout(() => {
        router.push("/register");
      }, 2000);
      return;
    }

    if (isCompleted) {
      updateStep(24);
      router.push("/bmr");
    } else {
      handleSubmitUserInfo();
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
                    <img src="/images/loader.svg" className="bmr-img" alt="BMR Graph" />

          
                  )}
                </div>

                {isSubmitting && !isCompleted ? (
                  <div className="text-center">
                    <h3 className="mb-4">Creating Your Profile...</h3>
                    <p>
                      Please wait while we process your information and create
                      your personalized fitness plan.
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
                    <h3 className="mb-4">Submitting Your Information...</h3>
                    <p>
                      Please wait while we create your personalized fitness
                      profile.
                    </p>
                  </div>
                )}

                <div className="text-center mt-3">
                  <button
                    onClick={handleContinue}
                    className="custom-btn continue-btn"
                    disabled={isSubmitting || state.loading}
                  >
                    {isSubmitting || state.loading
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