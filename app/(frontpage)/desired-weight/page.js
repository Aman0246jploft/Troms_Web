'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "../../../context/OnboardingContext";
import Alert from "../../../Components/Alert";

function DesiredWeightPage() {
  const router = useRouter();
  const { state, updateField, updateStep, isStepValid, toggleUnitSystem } = useOnboarding();
  
  // Use global unit system
  const isMetric = state.unitSystem === "metric";
  
  // Calculate smart default value based on weight goal
  const calculateDefaultWeight = () => {
    if (!state.weight || !state.weightGoal) return 0;
    
    // Get current weight in the display unit
    const currentWeight = state.weight;
    const currentWeightUnit = state.weightUnit;
    
    // Convert current weight to display unit if needed
    let displayWeight = currentWeight;
    if (currentWeightUnit === 'kg' && !isMetric) {
      // Convert kg to lbs for display
      displayWeight = Math.round(currentWeight / 0.453592 * 10) / 10;
    } else if (currentWeightUnit === 'lbs' && isMetric) {
      // Convert lbs to kg for display
      displayWeight = Math.round(currentWeight * 0.453592 * 10) / 10;
    }
    
    // Calculate default based on goal
    switch (state.weightGoal) {
      case 'MAINTAIN':
        return displayWeight; // Same as current weight
      case 'LOSE_WEIGHT':
        // Default to 5-10% weight loss
        const lossAmount = isMetric ? Math.max(2, displayWeight * 0.08) : Math.max(5, displayWeight * 0.08);
        return Math.round((displayWeight - lossAmount) * 10) / 10;
      case 'GAIN_WEIGHT':
        // Default to 3-5% weight gain
        const gainAmount = isMetric ? Math.max(2, displayWeight * 0.05) : Math.max(5, displayWeight * 0.05);
        return Math.round((displayWeight + gainAmount) * 10) / 10;
      default:
        return displayWeight;
    }
  };

  const [desiredWeight, setDesiredWeight] = useState(() => {
    // If we have a saved desiredWeight in context, use it
    if (state.desiredWeight && state.desiredWeight > 0) {
      return state.desiredWeight;
    }
    // Otherwise, calculate smart default
    return calculateDefaultWeight();
  });
  
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  // Initialize component and set defaults
  useEffect(() => {
    // Handle redirects first
    if (state.isAuthChecked && state.isAuthenticated === false) {
      router.push('/register');
      return;
    }
    if (!state.weightGoal) {
      router.push('/weight-goal');
      return;
    }

    // Set current step
    if (state.currentStep !== 9) {
      updateStep(9);
    }

    // Initialize default value if not already set
    if (!state.desiredWeight || state.desiredWeight === 0) {
      const defaultWeight = calculateDefaultWeight();
      if (defaultWeight > 0) {
        setDesiredWeight(defaultWeight);
        updateField('desiredWeight', defaultWeight);
      }
    }
  }, [state.isAuthChecked, state.isAuthenticated, state.weightGoal, state.currentStep]);

  // Handle unit changes by recalculating weight if needed
  useEffect(() => {
    if (state.weight && state.weightGoal && desiredWeight > 0) {
      // Recalculate default when unit preference changes
      const newDefault = calculateDefaultWeight();
      if (Math.abs(newDefault - desiredWeight) > (isMetric ? 1 : 2)) {
        setDesiredWeight(newDefault);
        updateField('desiredWeight', newDefault);
      }
    }
  }, [isMetric]);


  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
  };

  const hideAlert = () => {
    setAlert({ show: false, type: '', message: '' });
  };

  const handleUnitToggle = () => {
    const currentIsMetric = isMetric;
    
    // Toggle the global unit system
    toggleUnitSystem();

    let convertedWeight = desiredWeight;

    if (currentIsMetric) {
      // Currently metric, converting to imperial (kg to lbs)
      convertedWeight = Math.round(desiredWeight / 0.453592 * 10) / 10;
    } else {
      // Currently imperial, converting to metric (lbs to kg)
      convertedWeight = Math.round(desiredWeight * 0.453592 * 10) / 10;
    }

    // Update both local state and context
    setDesiredWeight(convertedWeight);
    updateField('desiredWeight', convertedWeight);
    hideAlert();
  };

  const handleWeightChange = (value) => {
    setDesiredWeight(value);
    updateField('desiredWeight', value);
    hideAlert();
  };

  const validateWeight = () => {
    const currentWeight = state.weight;
    const goal = state.weightGoal;

    if (isMetric) {
      // Convert current weight to kg for comparison
      const currentWeightKg = state.weightUnit === 'lbs' ? currentWeight * 0.453592 : currentWeight;

      if (goal === 'LOSE_WEIGHT' && desiredWeight >= currentWeightKg) {
        return 'Desired weight must be less than current weight to lose weight.';
      }
      if (goal === 'GAIN_WEIGHT' && desiredWeight <= currentWeightKg) {
        return 'Desired weight must be greater than current weight to gain weight.';
      }
      if (goal === 'MAINTAIN' && Math.abs(desiredWeight - currentWeightKg) > 2) {
        return 'For maintenance, desired weight should be close to current weight (±2 kg).';
      }
    } else {
      // Convert current weight to lbs for comparison
      const currentWeightLbs = state.weightUnit === 'kg' ? currentWeight / 0.453592 : currentWeight;

      if (goal === 'LOSE_WEIGHT' && desiredWeight >= currentWeightLbs) {
        return 'Desired weight must be less than current weight to lose weight.';
      }
      if (goal === 'GAIN_WEIGHT' && desiredWeight <= currentWeightLbs) {
        return 'Desired weight must be greater than current weight to gain weight.';
      }
      if (goal === 'MAINTAIN' && Math.abs(desiredWeight - currentWeightLbs) > 5) {
        return 'For maintenance, desired weight should be close to current weight (±5 lbs).';
      }
    }

    return null; // No validation error
  };

  const handleContinue = (e) => {
    e.preventDefault();

    if (!desiredWeight || desiredWeight <= 0) {
      showAlert('warning', 'Please enter your desired weight to continue.');
      return;
    }

    const validationError = validateWeight();
    if (validationError) {
      showAlert('warning', validationError);
      return;

    }

    if (isStepValid(9)) {
      updateStep(10);
      router.push('/workout-location');
    }
  };

  const getWeightRange = () => {
    const currentWeight = state.weight;
    const goal = state.weightGoal;

    if (goal === 'MAINTAIN') {
      const tolerance = isMetric ? 2 : 5;
      return `±${tolerance} ${isMetric ? 'kg' : 'lbs'} from current weight`;
    } else if (goal === 'LOSE_WEIGHT') {
      return `Less than ${isMetric ? Math.round(currentWeight * 0.453592) : currentWeight} ${isMetric ? 'kg' : 'lbs'}`;
    } else if (goal === 'GAIN_WEIGHT') {
      return `Greater than ${isMetric ? Math.round(currentWeight * 0.453592) : currentWeight} ${isMetric ? 'kg' : 'lbs'}`;
    }
    return '';
  };

  const getCurrentWeightDisplay = () => {
    if (isMetric) {
      const currentWeightKg = state.weightUnit === 'lbs' ? state.weight * 0.453592 : state.weight;
      return `${Math.round(currentWeightKg * 10) / 10} kg`;
    } else {
      const currentWeightLbs = state.weightUnit === 'kg' ? state.weight / 0.453592 : state.weight;
      return `${Math.round(currentWeightLbs * 10) / 10} lbs`;
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

              <div className="auth-cards weight">
                <p className="text-uppercase mb-5">Desired Weight</p>
                <h3 className="mb-2">What is your desired weight?</h3>
                <p>Set your target weight based on your goal: <strong>{state.weightGoal?.replace('_', ' ')}</strong></p>
                
                {/* {state.weightGoal && (
                  <div className="mb-3 p-2 bg-light rounded text-center">
                    <small className="text-muted">
                      {state.weightGoal === 'MAINTAIN' && 'We suggest maintaining your current weight'}
                      {state.weightGoal === 'LOSE_WEIGHT' && 'We suggest a healthy 5-8% weight loss goal'}
                      {state.weightGoal === 'GAIN_WEIGHT' && 'We suggest a moderate 3-5% weight gain goal'}
                    </small>
                  </div>
                )} */}

                {/* <div className="mb-4 p-3 bg-light rounded">
                  <p className="mb-1"><strong>Current Weight:</strong> {getCurrentWeightDisplay()}</p>
                  <p className="mb-0"><strong>Target Range:</strong> {getWeightRange()}</p>
                </div> */}

                <form onSubmit={handleContinue}>
                  <div className="weight-switch">
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
                  <div className="weight-input">
                    <div className="height-bx-main">
                      <p className="text-center mb-2">Desired Weight</p>
                      <div className="height-bx lbs-weight">
                        <div className="height-input border-0">
                          <input
                            type="number"
                            min={isMetric ? "30" : "60"}
                            max={isMetric ? "300" : "600"}
                            step="0.01"
                            value={desiredWeight || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              handleWeightChange(val === "" ? 0 : parseFloat(val));
                            }}
                            required
                          />
                          <span>{isMetric ? 'kg' : 'lbs'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/*                   
                  {state.weightGoal === 'MAINTAIN' && (
                    <div className="mt-3 p-3 bg-info bg-opacity-10 rounded">
                      <p className="mb-0 text-center small text-info">
                        <strong>Note:</strong> For maintenance, your desired weight will be set to your current weight.
                      </p>
                    </div>
                  )}
                   */}
                  <div className="text-center mt-5">
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
