'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "../../../context/OnboardingContext";
import Alert from "../../../Components/Alert";

function TrainingDaysPage() {
  const router = useRouter();
  const { state, updateField, updateStep, isStepValid } = useOnboarding();
  const [selectedDays, setSelectedDays] = useState(state.trainingDays);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  // Redirects based on previous steps
  useEffect(() => {
    if (state.isAuthChecked && state.isAuthenticated === false) {
      router.push('/register');
    } else if (!state.gender) {
      router.push('/select-gender');
    } else if (!state.dateOfBirth || state.age < 13) {
      router.push('/borndate');
    }
  }, [state.isAuthenticated, state.gender, state.dateOfBirth, state.age, router]);
  useEffect(() => {
    updateStep(4);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run only once

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
  };

  const hideAlert = () => {
    setAlert({ show: false, type: '', message: '' });
  };

  const handleDaysChange = (days) => {
    setSelectedDays(days);
    updateField('trainingDays', days);
    hideAlert();
  };

  const handleContinue = (e) => {
    e.preventDefault();

    if (!selectedDays || selectedDays < 1) {
      showAlert('warning', 'Please select how many days per week you can train.');
      return;
    }

    if (isStepValid(4)) {
      updateStep(5);
      router.push('/train-more');
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

              <div className="auth-cards training">
                <p className="text-uppercase mb-5">Work Out</p>
                <h3 className="mb-2">
                  How often do you work <br /> out each week?
                </h3>
                <p>Personalizing Your Plan Based on Your Input</p>
                <form onSubmit={handleContinue}>
                  <h6>Training days</h6>
                  <div className="training-day-list">
                    {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                      <div key={day}>
                        <input
                          type="radio"
                          className="d-none"
                          id={`day-${day}`}
                          name="training-days"
                          value={day}
                          checked={selectedDays === day}
                          onChange={() => handleDaysChange(day)}
                        />
                        <label
                          htmlFor={`day-${day}`}
                          className={selectedDays === day ? 'selected' : ''}
                        >
                          {day}
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="text-center mt-5">
                    <button
                      type="submit"
                      className="custom-btn continue-btn"
                      disabled={!selectedDays || selectedDays < 1}
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

export default TrainingDaysPage;
