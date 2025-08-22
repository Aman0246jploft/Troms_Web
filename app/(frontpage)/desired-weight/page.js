'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "../../../context/OnboardingContext";
import Alert from "../../../Components/Alert";

function DesiredWeightPage() {
  const router = useRouter();
  const { state, updateField, updateStep, isStepValid } = useOnboarding();
  const [isMetric, setIsMetric] = useState(state.weightUnit === 'kg');
const [desiredWeight, setDesiredWeight] = useState(() => {
  // If we have a saved desiredWeight in context, use it (with unit conversion if needed)
  if (state.desiredWeight && state.desiredWeight > 0) {
    // Check if we need unit conversion
    const currentUnitIsMetric = state.weightUnit === 'kg';
    const displayUnitIsMetric = state.weightUnit === 'kg';
    
    if (currentUnitIsMetric === displayUnitIsMetric) {
      return state.desiredWeight;
    } else if (displayUnitIsMetric && !currentUnitIsMetric) {
      // Convert from lbs to kg
      return Math.round(state.desiredWeight * 0.453592 * 10) / 10;
    } else if (!displayUnitIsMetric && currentUnitIsMetric) {
      // Convert from kg to lbs
      return Math.round(state.desiredWeight / 0.453592 * 10) / 10;
    }
    return state.desiredWeight;
  }
  
  // If no saved value, calculate default based on weight goal
  if (state.weightGoal === 'MAINTAIN') return state.weight;
  if (state.weightGoal === 'LOSE_WEIGHT') return Math.round(state.weight * 0.95 * 10) / 10;
  if (state.weightGoal === 'GAIN_WEIGHT') return Math.round(state.weight * 1.05 * 10) / 10;
  return 0;
});
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  // Sync local state with context state when context updates
  useEffect(() => {
    // Only sync if context has a significantly different value (not just from unit conversion)
    if (state.desiredWeight && state.desiredWeight > 0) {
      // Apply unit conversion if needed when syncing from context
      const currentUnitIsMetric = state.weightUnit === 'kg';
      const displayUnitIsMetric = isMetric;
      
      let convertedWeight = state.desiredWeight;
      if (currentUnitIsMetric !== displayUnitIsMetric) {
        if (displayUnitIsMetric && !currentUnitIsMetric) {
          // Convert from lbs to kg
          convertedWeight = Math.round(state.desiredWeight * 0.453592 * 10) / 10;
        } else if (!displayUnitIsMetric && currentUnitIsMetric) {
          // Convert from kg to lbs
          convertedWeight = Math.round(state.desiredWeight / 0.453592 * 10) / 10;
        }
      }
      
      // Only update if the converted value is significantly different from current local state
      const difference = Math.abs(convertedWeight - desiredWeight);
      if (difference > 0.1 && desiredWeight === 0) {
        setDesiredWeight(convertedWeight);
      }
    }
  }, [state.desiredWeight]); // Removed state.weightUnit and isMetric to avoid conflicts

  useEffect(() => {
  if (state.isAuthChecked && state.isAuthenticated === false) {
    router.push('/register');
    return;
  }
  if (!state.weightGoal) {
    router.push('/weight-goal');
    return;
  }

  if (state.currentStep !== 8) {
    updateStep(8);
  }
}, []);

  // Save the calculated default desiredWeight to context when component loads
  useEffect(() => {
    if (desiredWeight > 0 && (!state.desiredWeight || state.desiredWeight === 0)) {
      updateField('desiredWeight', desiredWeight);
    }
  }, [desiredWeight, state.desiredWeight, updateField]);


  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
  };

  const hideAlert = () => {
    setAlert({ show: false, type: '', message: '' });
  };

  const handleUnitToggle = () => {
    const newIsMetric = !isMetric;
    setIsMetric(newIsMetric);
    
    let convertedWeight = desiredWeight;
    
    if (newIsMetric) {
      // Convert to metric (lbs to kg)
      convertedWeight = Math.round(desiredWeight * 0.453592 * 10) / 10;
      updateField('weightUnit', 'kg');
    } else {
      // Convert to imperial (kg to lbs)
      convertedWeight = Math.round(desiredWeight / 0.453592 * 10) / 10;
      updateField('weightUnit', 'lbs');
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

    if (isStepValid(8)) {
      updateStep(9);
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
                {/* <p>Set your target weight based on your goal: <strong>{state.weightGoal?.replace('_', ' ')}</strong></p> */}
                
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
                            step="0.1"
                            value={desiredWeight}
                            onChange={(e) => handleWeightChange(parseFloat(e.target.value) || 0)}
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
