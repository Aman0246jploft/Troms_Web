'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "../../../context/OnboardingContext";
import Alert from "../../../Components/Alert";

function AccomplishPage() {
  const router = useRouter();
  const { state, updateField, updateStep, isStepValid } = useOnboarding();
  const [selectedGoal, setSelectedGoal] = useState(
    state.accomplish && state.accomplish.length > 0 ? state.accomplish[0] : ''
  );
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  const accomplishmentOptions = [
    { id: 'STAY_ACTIVE_DAILY', label: 'Stay active daily' },
    { id: 'BOOST_YOUR_ENERGY', label: 'Boost your energy' },
    { id: 'IMPROVE_YOUR_FOCUS', label: 'Improve your focus' },
    { id: 'GAIN_MORE_CONFIDENCE', label: 'Gain more confidence' }
  ];

  useEffect(() => {
    if (!state.isAuthChecked) return; // wait for auth check

    if (state.isAuthenticated === false) {
      router.push('/register');
      return;
    }
    if (!state.cookingLevel) {
      router.push('/cooking');
      return;
    }

    // Only update step if it's not already set
    if (state.currentStep !== 18) {
      updateStep(18);
    }
  }, [state.isAuthChecked, state.isAuthenticated, state.cookingLevel, state.currentStep, router, updateStep]);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
  };

  const hideAlert = () => {
    setAlert({ show: false, type: '', message: '' });
  };

  const handleGoalChange = (goalId) => {
    setSelectedGoal(goalId);
    // Store as single item in array
    updateField('accomplish', [goalId]);
    hideAlert();
  };

  const handleContinue = (e) => {
    e.preventDefault();
    
    if (!selectedGoal) {
      showAlert('warning', 'Please select what you would like to accomplish.');
      return;
    }

    if (isStepValid(18)) {
      updateStep(19);
      router.push('/allergies');
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
                <p className="text-uppercase mb-3">Accomplish</p>
                <h3 className="mb-3">
                  What would you like <br /> to accomplish?
                </h3>
                <div className="px-135">
                  <form onSubmit={handleContinue}>
                    {accomplishmentOptions.map((option) => (
                      <div key={option.id} className="custom-check">
                        <input
                          type="radio"
                          id={option.id}
                          name="Accomplish"
                          className="d-none"
                          value={option.id}
                          checked={selectedGoal === option.id}
                          onChange={() => handleGoalChange(option.id)}
                        />
                        <label 
                          htmlFor={option.id}
                          className={selectedGoal === option.id ? 'selected' : ''}
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}

                    <div className="text-center mt-3">
                      <button
                        type="submit"
                        className="custom-btn continue-btn"
                        disabled={!selectedGoal}
                      >
                        Continue
                      </button>
                    </div>
                  </form>
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

export default AccomplishPage;
