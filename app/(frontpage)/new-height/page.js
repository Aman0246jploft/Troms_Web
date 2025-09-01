"use client";
import HeightPicker from "../../../Components/HeightPicker";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "../../../context/OnboardingContext";
import Alert from "../../../Components/Alert";

function NewHeightPage() {
  const router = useRouter();
  const { state, updateField, updateStep, isStepValid } = useOnboarding();
  const [height, setHeight] = useState(state.height || 165);
  const [isMetric, setIsMetric] = useState(true);
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
    }
  }, [state.isAuthenticated, state.gender, state.dateOfBirth, state.age, state.trainingDays, state.feedback, router]);

  useEffect(() => {
    updateStep(6);
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

  const handleUnitChange = (newIsMetric) => {
    setIsMetric(newIsMetric);
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

    if (isStepValid(6)) {
      updateStep(7);
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
                
                <HeightPicker 
                  defaultValueCm={height}
                  onChange={handleHeightChange}
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
