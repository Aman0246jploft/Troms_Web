"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useOnboarding } from "../../../context/OnboardingContext";
import Alert from "../../../Components/Alert";

function GoalRangePage() {
  const router = useRouter();
  const { state, updateField, updateStep, isStepValid } = useOnboarding();
  const [value, setValue] = useState(state.weeklyWeightLossGoal || 1.2);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  // Update CSS variable for fill
  useEffect(() => {
    const percent = ((value - 0.5) / (2 - 0.5)) * 100;
    document.documentElement.style.setProperty("--range-percent", `${percent}%`);
  }, [value]);

  // Redirect if not authenticated
  useEffect(() => {
    if (state.isAuthChecked && state.isAuthenticated === false) {
      router.push('/register');
    }
  }, [state.isAuthenticated, router]);

  // Set current step
  useEffect(() => {
    updateStep(11);
  }, []);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
  };

  const hideAlert = () => {
    setAlert({ show: false, type: '', message: '' });
  };

  const handleValueChange = (val) => {
    setValue(val);
    updateField('weeklyWeightLossGoal', val); // update onboarding context
    hideAlert();
  };

  const handleContinue = (e) => {
    e.preventDefault();

    if (!value) {
      showAlert('warning', 'Please select your weekly weight loss goal.');
      return;
    }

    if (isStepValid(11)) {
      updateStep(12);
      router.push('/realistic-target');
    }
  };

  return (
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

            <div className="auth-cards gender">
              <p className="text-uppercase mb-5">Reach your goal</p>
              <h3 className="mb-2">How fast do you wanna reach your goal?</h3>
              <p>Weight loss speed per week</p>
              <div className="goal-range">
                <h5 className="text-center">{value} lbs</h5>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={value}
                  onChange={(e) => handleValueChange(parseFloat(e.target.value))}
                  className="slider"
                />
                <div className="labels">
                  <span>0.5 lbs</span>
                  <span>2.0 lbs</span>
                </div>
              </div>

              <div className="text-center mt-5">
                <button
                  type="button"
                  className="custom-btn continue-btn"
                  onClick={handleContinue}
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
  );
}

export default GoalRangePage;
