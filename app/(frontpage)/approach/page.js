'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "../../../context/OnboardingContext";
import { apiService } from "../../../lib/api";
import Alert from "../../../Components/Alert";

function ApproachPage() {
  const router = useRouter();
  const { state, setLoading, setError, updateStep, updateField, getFinalPayload } = useOnboarding();
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

useEffect(() => {
  // Redirect if not authenticated
  if (state.isAuthChecked && state.isAuthenticated === false) {
    router.push('/register');
    return;
  }

  // Check if all required fields are filled
  const requiredFields = [
    'gender', 'dateOfBirth', 'age', 'trainingDays', 'weight', 'weightGoal',
    'desiredWeight', 'workoutLocation', 'selectedEquipments', 'reachingGoals',
    'accomplish', 'dietType', 'cheatMealFoodItems',
    'cookingLevel', 'allergicFoodItems', 'dislikedFoodItems', 'injuries'
  ];

  const missingFields = requiredFields.filter(field => {
    const value = state[field];
    if (Array.isArray(value)) return value.length === 0;
    return !value || value === '';
  });

  if (missingFields.length > 0) {
    console.log('Missing fields:', missingFields);
    showAlert('warning', 'Please complete all previous steps before proceeding.');
    return;
  }

  // ✅ Only update step if not already set
  if (state.currentStep !== 23) {
    updateStep(23);
  }
}, [state.isAuthChecked, state.isAuthenticated, state.currentStep]);

useEffect(() => {
  if (state.currentStep === 23 && !isCompleted && !isSubmitting) {
    handleSubmitUserInfo();
  }
}, [state.currentStep, isCompleted, isSubmitting]);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
  };

  const hideAlert = () => {
    setAlert({ show: false, type: '', message: '' });
  };

  const handleSubmitUserInfo = async () => {
    setIsSubmitting(true);
    setLoading(true);
    hideAlert();

    try {
      const payload = getFinalPayload();
      console.log('Submitting user data:', payload);
      
      const response = await apiService.createUserInfo(payload);
      
      if (response.success) {
        setIsCompleted(true);
        // Mark onboarding as complete
        updateField('needsOnboarding', false);
        // showAlert('success', 'Your profile has been created successfully!');
        
        // Auto-redirect after success
        setTimeout(() => {
          router.push('/bmr');
        }, 2000);
      } else {
        showAlert('error', response.message || 'Failed to create profile. Please try again.');
      }
    } catch (error) {
      console.error('User info submission error:', error);
      showAlert('error', 'Failed to create profile. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const handleContinue = () => {
    if (isCompleted) {
      updateStep(24);
      router.push('/bmr');
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
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
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
                    <h3 className="mb-4">Thank you for your information!</h3>
                    <p>
                      We promise to always keep your personal <br /> information
                      private and secure. Your profile has been created successfully!
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <h3 className="mb-4">Submitting Your Information...</h3>
                    <p>
                      Please wait while we create your personalized fitness profile.
                    </p>
                  </div>
                )}

                <div className="text-center mt-3">
                  <button 
                    onClick={handleContinue}
                    className="custom-btn continue-btn"
                    disabled={isSubmitting || state.loading}
                  >
                    {isSubmitting || state.loading ? 'Processing...' : 'Continue'}
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
