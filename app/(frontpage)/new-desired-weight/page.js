"use client";

import DesiredWeightPicker from "../../../Components/DesiredWeightPicker";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "../../../context/OnboardingContext";
import Alert from "../../../Components/Alert";

function DesiredWeightPage() {
  const router = useRouter();
  const { state, updateField, updateStep, isStepValid } = useOnboarding();

  // Use global unit system
  const isMetric = state.unitSystem === "metric";

  // Convert current weight to display unit if needed
  const getCurrentWeightInDisplayUnit = () => {
    if (!state.weight) return 0;

    const currentWeight = state.weight;
    const currentWeightUnit = state.weightUnit;

    let displayWeight = currentWeight;
    if (currentWeightUnit === "kg" && !isMetric) {
      // Convert kg to lbs for display
      displayWeight = Math.round((currentWeight / 0.453592) * 10) / 10;
    } else if (currentWeightUnit === "lbs" && isMetric) {
      // Convert lbs to kg for display
      displayWeight = Math.round(currentWeight * 0.453592 * 10) / 10;
    }

    return displayWeight;
  };

  // Calculate dynamic min/max values based on weight goal
  const calculateMinMaxWeight = () => {
    const currentDisplayWeight = getCurrentWeightInDisplayUnit();

    if (!currentDisplayWeight || !state.weightGoal) {
      // Default fallback values
      return {
        min: isMetric ? 35 : 77, // Changed from 30 to 35 kg, 77 lbs (35kg converted)
        max: isMetric ? 317 : 699,
      };
    }

    let minWeight, maxWeight;

    switch (state.weightGoal) {
      case "LOSE_WEIGHT":
        // For weight loss: min = current weight - 10, max = current weight - 1
        minWeight = isMetric ? 35 : 77; // Use absolute minimum
        maxWeight = Math.round((currentDisplayWeight - 1) * 4) / 4;
        break;
        break;

      case "GAIN_WEIGHT":
        // For weight gain: min = current weight + 1, max = current weight + 10
        minWeight = Math.round((currentDisplayWeight + 1) * 4) / 4;
        maxWeight = isMetric ? 317 : 699; // Use absolute maximum
        break;

      case "MAINTAIN":
        // For maintenance: no weight change allowed - set min and max to current weight
        minWeight = Math.round(currentDisplayWeight * 4) / 4;
        maxWeight = Math.round(currentDisplayWeight * 4) / 4;
        break;

      default:
        // Default fallback values
        return {
          min: isMetric ? 30 : 60,
          max: isMetric ? 300 : 600,
        };
    }

    return { min: minWeight, max: maxWeight };
  };

  // Calculate smart default value based on weight goal
  const calculateDefaultWeight = () => {
    if (!state.weight || !state.weightGoal) return 0;

    const displayWeight = getCurrentWeightInDisplayUnit();

    // Calculate default based on goal
    switch (state.weightGoal) {
      case "MAINTAIN":
        return displayWeight; // Same as current weight
      case "LOSE_WEIGHT":
        // Default to middle of the range (current weight - 5)
        return Math.round((displayWeight - 5) * 4) / 4;
      case "GAIN_WEIGHT":
        // Default to middle of the range (current weight + 5)
        return Math.round((displayWeight + 5) * 4) / 4;
      default:
        return displayWeight;
    }
  };

  // Memoize min/max values to avoid recalculation on every render
  const { min: minWeight, max: maxWeight } = useMemo(() => {
    return calculateMinMaxWeight();
  }, [state.weight, state.weightGoal, state.weightUnit, isMetric]);

  const [desiredWeight, setDesiredWeight] = useState(() => {
    // If we have a saved desiredWeight in context, use it
    if (state.desiredWeight && state.desiredWeight > 0) {
      return state.desiredWeight;
    }
    // Otherwise, calculate smart default
    return calculateDefaultWeight();
  });

  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  // Initialize component and set defaults
  useEffect(() => {
    // Handle redirects first
    if (state.isAuthChecked && state.isAuthenticated === false) {
      router.push("/register");
      return;
    }

    // If user has MAINTAIN goal, they should skip this step and go directly to workout location
    if (state.weightGoal === "MAINTAIN") {
      router.push("/workout-location");
      return;
    }
    if (!state.weightGoal) {
      router.push("/weight-goal");
      return;
    }

    // Set current step
    if (state.currentStep !== 9) {
      updateStep(10);
    }

    // Initialize default value if not already set
    if (!state.desiredWeight || state.desiredWeight === 0) {
      const defaultWeight = calculateDefaultWeight();
      if (defaultWeight > 0) {
        setDesiredWeight(defaultWeight);
        updateField("desiredWeight", defaultWeight);
      }
    }
  }, [
    state.isAuthChecked,
    state.isAuthenticated,
    state.weightGoal,
    state.currentStep,
  ]);

  // Handle unit changes and weight goal changes by recalculating weight if needed
  useEffect(() => {
    if (state.weight && state.weightGoal && desiredWeight > 0) {
      // Recalculate default when unit preference or weight goal changes
      const newDefault = calculateDefaultWeight();
      if (Math.abs(newDefault - desiredWeight) > (isMetric ? 1 : 2)) {
        setDesiredWeight(newDefault);
        updateField("desiredWeight", newDefault);
      }
    }
  }, [isMetric, state.weightGoal]);

  // Ensure desired weight is within new min/max bounds when they change
  useEffect(() => {
    if (
      desiredWeight > 0 &&
      (desiredWeight < minWeight || desiredWeight > maxWeight)
    ) {
      // Clamp the desired weight to the new bounds
      const clampedWeight = Math.max(
        minWeight,
        Math.min(maxWeight, desiredWeight)
      );
      setDesiredWeight(clampedWeight);
      updateField("desiredWeight", clampedWeight);
    }
  }, [minWeight, maxWeight, desiredWeight]);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
  };

  const hideAlert = () => {
    setAlert({ show: false, type: "", message: "" });
  };

  const handleWeightChange = (value) => {
    setDesiredWeight(value);
    updateField("desiredWeight", value);
    hideAlert();
  };

  const validateWeight = () => {
    const currentDisplayWeight = getCurrentWeightInDisplayUnit();
    const goal = state.weightGoal;

    // if (goal === 'LOSE_WEIGHT') {
    //   if (desiredWeight >= currentDisplayWeight) {
    //     return 'Desired weight must be less than current weight to lose weight.';
    //   }
    //   if (desiredWeight < currentDisplayWeight - 10) {
    //     return `Maximum weight loss allowed is 10 ${isMetric ? 'kg' : 'lbs'}.`;
    //   }
    // }

    // if (goal === 'GAIN_WEIGHT') {
    //   if (desiredWeight <= currentDisplayWeight) {
    //     return 'Desired weight must be greater than current weight to gain weight.';
    //   }
    //   if (desiredWeight > currentDisplayWeight + 10) {
    //     return `Maximum weight gain allowed is 10 ${isMetric ? 'kg' : 'lbs'}.`;
    //   }
    // }

    // if (goal === 'MAINTAIN') {
    //   // For maintenance, desired weight must be exactly the current weight
    //   if (Math.abs(desiredWeight - currentDisplayWeight) > 0.1) {
    //     return 'For maintenance, your desired weight should remain the same as your current weight.';
    //   }
    // }

    return null; // No validation error
  };

  const handleContinue = (e) => {
    e.preventDefault();

    if (!desiredWeight || desiredWeight <= 0) {
      showAlert("warning", "Please enter your desired weight to continue.");
      return;
    }

    const validationError = validateWeight();
    if (validationError) {
      showAlert("warning", validationError);
      return;
    }

    // if (isStepValid(10)) {
    updateStep(11);
    router.push("/workout-location");
    // }
    // else {
    //   showAlert('warning', 'Please ensure your desired weight is appropriate for your selected goal.');
    // }
  };

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

              <Alert
                type={alert.type}
                message={alert.message}
                show={alert.show}
                onClose={hideAlert}
              />

              <div className="auth-cards new-desired-weight">
                <button type="button" className="new_back_btn">
                  Previous
                </button>
                <p className="text-uppercase mb-2">Desired Weight</p>
                <h3 className="mb-2">What is your desired weight?</h3>
                <p>
                  Set your target weight based on your goal:{" "}
                  <strong>{state.weightGoal?.replace("_", " ")}</strong>
                </p>

                {state.weightGoal === "MAINTAIN" && (
                  <div className="alert alert-info mt-3 mb-4">
                    <strong>Maintain Goal:</strong> Your desired weight will
                    remain the same as your current weight (
                    {getCurrentWeightInDisplayUnit()} {isMetric ? "kg" : "lbs"}
                    ).
                  </div>
                )}

                <form onSubmit={handleContinue}>
                  <DesiredWeightPicker
                    weight={desiredWeight}
                    isMetric={isMetric}
                    onChange={handleWeightChange}
                    minWeight={minWeight}
                    maxWeight={maxWeight}
                    currentWeight={state.weight}
                    weightGoal={state.weightGoal}
                    currentWeightUnit={state.weightUnit}
                    disabled={state.weightGoal === "MAINTAIN"}
                  />

                  <div className="text-center mt-2">
                    <button
                      type="submit"
                      className="custom-btn continue-btn"
                      disabled={!desiredWeight || desiredWeight <= 0}
                    >
                      Continue
                    </button>
                  </div>
                </form>
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

export default DesiredWeightPage;
