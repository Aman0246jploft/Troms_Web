"use client";
import HeightPicker from "../../../Components/HeightPicker";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "../../../context/OnboardingContext";
import Alert from "../../../Components/Alert";

function NewHeightPage() {
  const router = useRouter();
  const { state, updateField, updateStep, isStepValid, toggleUnitSystem } = useOnboarding();
  const [height, setHeight] = useState(state.height || 165);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  
  // Use global unit system
  const isMetric = state.unitSystem === "metric";

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
    } else if (state.trainMoreThanOnce === undefined) {
      router.push('/train-more');
    } else if (state.feedback === null) {
      router.push('/feedback');
    }
  }, [state.isAuthenticated, state.gender, state.dateOfBirth, state.age, state.trainingDays, state.trainMoreThanOnce, state.feedback, router]);

  useEffect(() => {
    updateStep(7);
    
    // Initialize height in global state if not already set
    if (!state.height && height > 0) {
      updateField('height', height);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run only once

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
  };

  const hideAlert = () => {
    setAlert({ show: false, type: '', message: '' });
  };

  const handleHeightChange = (newHeight) => {
    setHeight(newHeight);
    updateField('height', newHeight);
    hideAlert();
  };

  const handleUnitToggle = () => {
    toggleUnitSystem();
  };

  const handleContinue = (e) => {
    e.preventDefault();

    if (!height || height <= 0) {
      showAlert('warning', 'Please select a valid height.');
      return;
    }

    // Validate reasonable height range (120-250 cm to match component range)
    if (height < 120 || height > 250) {
      showAlert('warning', 'Please select a height between 120-250 cm.');
      return;
    }

    if (isStepValid(7)) {
      updateStep(8);
      router.push('/new-weight');
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

              <div className="auth-cards horizontal-height">
                <p className="text-uppercase mb-2">Your height</p>
                <h3 className="mb-2">What is your current height?</h3>
                <p className="mb-2">You can update it later if needed</p>
                
                <div className="weight-switch mb-3">
                  <span>Imperial</span>
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      className="d-none" 
                      checked={isMetric}
                      onChange={handleUnitToggle}
                    />
                    <span className="slider"></span>
                  </label>
                  <span>Metric</span>
                </div>
                
                <HeightPicker 
                  defaultValueCm={height}
                  onChange={handleHeightChange}
                  unit={isMetric ? "metric" : "imperial"}
                />
                <div className="text-center mt-3">
                  <button 
                    type="submit" 
                    className="custom-btn continue-btn"
                    onClick={handleContinue}
                    disabled={!height || height <= 0}
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

export default NewHeightPage;
