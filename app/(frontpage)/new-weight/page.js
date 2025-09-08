"use client";
import React, { useState, useEffect } from "react";
import WeightPicker from "../../../Components/WeightPicker";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useOnboarding } from "../../../context/OnboardingContext";
import Alert from "../../../Components/Alert";

function NewWeightPage() {
  const router = useRouter();
  const { state, updateField, updateStep, isStepValid } = useOnboarding();
  const [weight, setWeight] = useState(() => {
    // Initialize weight based on saved unit or default
    if (state.weight) {
      return state.weight;
    }
    return state.unitSystem === 'metric' ? 75 : 165;
  });
  
  // Use global unit system
  const isMetric = state.unitSystem === "metric";
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  // Redirects based on previous steps
  useEffect(() => {
    if (state.isAuthChecked && state.isAuthenticated === false) {
      router.push('/register');
    } else if (!state.gender) {
      router.push('/select-gender');
    } else if (!state.dateOfBirth || state.age < 13) {
      router.push('/borndate');
    } else if (!state.trainingDays) {
      router.push('/training-days');
    } else if (state.feedback === null) {
      router.push('/feedback');
    } else if (!state.height) {
      router.push('/new-height');
    }
  }, [state.isAuthenticated, state.gender, state.dateOfBirth, state.age, state.trainingDays, state.feedback, state.height, router]);

  useEffect(() => {
    updateStep(7);
    
    // Initialize weight if not set
    if (!state.weight) {
      updateField('weight', weight);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run only once

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
  };

  const hideAlert = () => {
    setAlert({ show: false, type: '', message: '' });
  };

  const handleWeightChange = (newWeight) => {
    setWeight(newWeight);
    updateField('weight', newWeight);
    hideAlert();
  };


  const handleContinue = (e) => {
    e.preventDefault();

    if (!weight || weight <= 0) {
      showAlert('warning', 'Please select a valid weight.');
      return;
    }

    // Validate reasonable weight range (matching component ranges)
    if (isMetric) {
      if (weight < 30 || weight > 300) {
        showAlert('warning', 'Please select a weight between 30-300 kg.');
        return;
      }
    } else {
      if (weight < 60 || weight > 600) {
        showAlert('warning', 'Please select a weight between 60-600 lbs.');
        return;
      }
    }

    if (isStepValid(7)) {
      updateStep(8);
      router.push('/weight-goal');
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

              <div className="auth-cards weight-goal">
                <p className="text-uppercase mb-2">Your Weight</p>
                <h3 className="mb-2">What is your current weight?</h3>
                <p className="mb-2">You can update it later if needed</p>
                

                <div className="trm-wgt-picker">
                  <WeightPicker 
                    weight={weight}
                    isMetric={isMetric}
                    onChange={handleWeightChange}
                  />
                </div>
                <div className="text-center mt-5">
                  <button 
                    type="submit" 
                    className="custom-btn continue-btn"
                    onClick={handleContinue}
                    disabled={!weight || weight <= 0}
                  >
                    Continue
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

export default NewWeightPage;
