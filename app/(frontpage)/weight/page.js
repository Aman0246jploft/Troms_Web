'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "../../../context/OnboardingContext";
import Alert from "../../../Components/Alert";

function WeightPage() {
  const router = useRouter();
  const { state, updateField, updateMultipleFields, updateStep, isStepValid } = useOnboarding();
  const [isMetric, setIsMetric] = useState(state.weightUnit === 'kg');
  const [heightFeet, setHeightFeet] = useState(5);
  const [heightInches, setHeightInches] = useState(8);
  const [heightCm, setHeightCm] = useState(170);
  const [weight, setWeight] = useState(state.weight || 150);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

useEffect(() => {
  if (state.isAuthChecked && state.isAuthenticated === false) {
    router.push('/register');
  } else if (!state.gender) {
    router.push('/select-gender');
  } else if (!state.dateOfBirth || state.age < 13) {
    router.push('/borndate');
  } else if (!state.trainingDays) {
    router.push('/training-days');
  }
}, [state.isAuthenticated, state.gender, state.dateOfBirth, state.age, state.trainingDays, router]);


useEffect(() => {
  updateStep(6);

  if (state.height > 0) {
    if (isMetric) {
      setHeightCm(Math.round(state.height));
    } else {
      const totalInches = state.height / 2.54;
      setHeightFeet(Math.floor(totalInches / 12));
      setHeightInches(Math.round(totalInches % 12));
    }
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []); // empty deps = run only once

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
  };

  const hideAlert = () => {
    setAlert({ show: false, type: '', message: '' });
  };

  const handleUnitToggle = () => {
    const newIsMetric = !isMetric;
    setIsMetric(newIsMetric);
    
    if (newIsMetric) {
      // Convert to metric
      const totalInches = (heightFeet * 12) + heightInches;
      const cm = totalInches * 2.54;
      setHeightCm(Math.round(cm));
      
      const kg = weight * 0.453592;
      setWeight(Math.round(kg * 10) / 10);
      
      updateField('weightUnit', 'kg');
    } else {
      // Convert to imperial
      const totalInches = heightCm / 2.54;
      setHeightFeet(Math.floor(totalInches / 12));
      setHeightInches(Math.round(totalInches % 12));
      
      const lbs = weight / 0.453592;
      setWeight(Math.round(lbs * 10) / 10);
      
      updateField('weightUnit', 'lbs');
    }
  };

  const updateHeight = () => {
    let heightInCm;
    if (isMetric) {
      heightInCm = heightCm;
    } else {
      const totalInches = (heightFeet * 12) + heightInches;
      heightInCm = totalInches * 2.54;
    }
    updateField('height', heightInCm);
  };

  useEffect(() => {
    updateHeight();
  }, [heightFeet, heightInches, heightCm, isMetric]);

  useEffect(() => {
    updateField('weight', weight);
  }, [weight]);

  const handleContinue = (e) => {
    e.preventDefault();
    
    if (!weight || weight <= 0) {
      showAlert('warning', 'Please enter a valid weight.');
      return;
    }

    if ((isMetric && heightCm <= 0) || (!isMetric && (heightFeet <= 0 || heightInches < 0))) {
      showAlert('warning', 'Please enter a valid height.');
      return;
    }

    // Validate reasonable ranges
    if (isMetric) {
      if (heightCm < 100 || heightCm > 250) {
        showAlert('warning', 'Please enter a height between 100-250 cm.');
        return;
      }
      if (weight < 30 || weight > 300) {
        showAlert('warning', 'Please enter a weight between 30-300 kg.');
        return;
      }
    } else {
      if (heightFeet < 3 || heightFeet > 8 || (heightFeet === 8 && heightInches > 6)) {
        showAlert('warning', 'Please enter a height between 3\'0" and 8\'6".');
        return;
      }
      if (weight < 60 || weight > 600) {
        showAlert('warning', 'Please enter a weight between 60-600 lbs.');
        return;
      }
    }

    if (isStepValid(6)) {
      updateStep(7);
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

              <div className="auth-cards weight">
                <p className="text-uppercase mb-5">Your Weight</p>
                <h3 className="mb-2">What is your current weight?</h3>
                <p>You can update it later if needed</p>

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
                      <p className="text-center mb-2">Height</p>
                      {isMetric ? (
                        <div className="height-bx">
                          <div className="height-input border-0">
                            <input 
                              type="number" 
                              min="100" 
                              max="250"
                              value={heightCm}
                              onChange={(e) => setHeightCm(parseInt(e.target.value) || 0)}
                            />
                            <span>cm</span>
                          </div>
                        </div>
                      ) : (
                        <div className="height-bx">
                          <div className="height-input">
                            <input 
                              type="number" 
                              min="3" 
                              max="8"
                              value={heightFeet}
                              onChange={(e) => setHeightFeet(parseInt(e.target.value) || 0)}
                            />
                            <span>ft</span>
                          </div>
                          <div className="height-input">
                            <input 
                              type="number" 
                              min="0" 
                              max="11"
                              value={heightInches}
                              onChange={(e) => setHeightInches(parseInt(e.target.value) || 0)}
                            />
                            <span>in</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="height-bx-main">
                      <p className="text-center mb-2">Weight</p>
                      <div className="height-bx lbs-weight">
                        <div className="height-input border-0">
                          <input 
                            type="number" 
                            min={isMetric ? "30" : "60"}
                            max={isMetric ? "300" : "600"}
                            step={isMetric ? "0.1" : "0.1"}
                            value={weight}
                            onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                          />
                          <span>{isMetric ? 'kg' : 'lbs'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center mt-5">
                    <button
                      type="submit"
                      className="custom-btn continue-btn"
                      disabled={!weight || weight <= 0}
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

export default WeightPage;
