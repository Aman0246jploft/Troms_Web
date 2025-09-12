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
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  // Use global unit system
  const isMetric = state.unitSystem === "metric";
  const weightUnit = isMetric ? "kg" : "lbs";

  // Convert weight loss values based on unit system
  const getDisplayValue = (lbsValue) => {
    if (isMetric) {
      // Convert lbs to kg (1 lb = 0.453592 kg)
      return (lbsValue * 0.453592).toFixed(1);
    }
    return lbsValue.toFixed(1);
  };

  const getMinValue = () => (isMetric ? "0.2" : "0.5");
  const getMaxValue = () => (isMetric ? "0.9" : "2.0");

  // Update CSS variable for fill
  useEffect(() => {
    let percent;
    if (isMetric) {
      const metricValue = value * 0.453592;
      percent = ((metricValue - 0.2) / (0.9 - 0.2)) * 100;
    } else {
      percent = ((value - 0.5) / (2 - 0.5)) * 100;
    }
    document.documentElement.style.setProperty(
      "--range-percent",
      `${percent}%`
    );
  }, [value, isMetric]);

  // Redirect if not authenticated
  useEffect(() => {
    if (state.isAuthChecked && state.isAuthenticated === false) {
      router.push("/register");
    }
  }, [state.isAuthChecked, state.isAuthenticated, router]);

  useEffect(() => {
    if (state.currentStep !== 13) {
      // compare with the step you actually want
      updateStep(13);
    }
  }, [state.currentStep, updateStep]);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
  };

  const hideAlert = () => {
    setAlert({ show: false, type: "", message: "" });
  };

  const handleValueChange = (val) => {
    setValue(val);
    updateField("weeklyWeightLossGoal", val); // update onboarding context
    hideAlert();
  };

  const handleContinue = () => {
    if (!value || isNaN(value)) {
      showAlert("warning", "Please select your weekly weight loss goal.");
      return;
    }

    // Optional: skip isStepValid if you want to debug
    // console.log("isStepValid:", isStepValid(11));

    updateStep(14);
    router.push("/realistic-target");
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
              <p className="text-uppercase mb-3">Reach your goal</p>
              <h3 className="mb-2">How fast do you wanna reach your goal?</h3>
              <p>Weight loss speed per week</p>
              <div className="goal-range">
                <h5 className="text-center">
                  {getDisplayValue(value)} {weightUnit}
                </h5>
                <input
                  type="range"
                  min={isMetric ? "0.2" : "0.5"}
                  max={isMetric ? "0.9" : "2.0"}
                  step={isMetric ? "0.05" : "0.1"}
                  value={isMetric ? (value * 0.453592).toFixed(2) : value}
                  onChange={(e) => {
                    const inputValue = parseFloat(e.target.value);
                    // Convert back to lbs for storage if metric
                    const storageValue = isMetric
                      ? inputValue / 0.453592
                      : inputValue;
                    handleValueChange(storageValue);
                  }}
                  className="slider"
                />
                <div className="labels">
                  <span>
                    {getMinValue()} {weightUnit}
                  </span>
                  <span>
                    {getMaxValue()} {weightUnit}
                  </span>
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
