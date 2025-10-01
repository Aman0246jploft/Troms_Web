'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "../../../context/OnboardingContext";

function trainingDayPage() {
  const router = useRouter();
  const { state, updateField, updateStep, isStepValid } = useOnboarding();
  const [selectedDays, setSelectedDays] = useState(state.trainingDays || []);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const WEEKDAYS = ["SUN","MON", "TUE", "WED", "THU", "FRI", "SAT"];

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
  }, []);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => {
      hideAlert();
    }, 3000);
  };

  const hideAlert = () => {
    setAlert({ show: false, type: '', message: '' });
  };

  const handleDaysChange = (day) => {
    let updatedDays;

    if (selectedDays.includes(day)) {
      updatedDays = selectedDays.filter(d => d !== day);
    } else {
      if (selectedDays.length >= 6) {
        showAlert('warning', 'You can select a maximum of 6 days per week.');
        return;
      }
      updatedDays = [...selectedDays, day];
    }

    setSelectedDays(updatedDays);
    updateField('trainingDays', updatedDays);
    updateField('trainingDay', updatedDays.length);
    hideAlert();
  };

  const handleContinue = (e) => {
    e.preventDefault();

    if (!selectedDays || selectedDays.length < 1) {
      showAlert('warning', 'Please select at least one day per week you can train.');
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

              {/* Modern Floating Alert */}
              {alert.show && (
                <div 
                  className="modern-alert-container"
                  style={{
                    position: 'fixed',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 9999,
                    animation: 'slideDown 0.3s ease-out'
                  }}
                >
                  <div 
                    className="modern-alert"
                    style={{
                      background: 'linear-gradient(135deg, #06402b 0%, #06402b 100%)',
                      color: 'white',
                      padding: '16px 24px',
                      borderRadius: '12px',
                      // boxShadow: '0 8px 24px #06402b',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      minWidth: '300px',
                      maxWidth: '90vw',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    <div 
                      className="alert-icon"
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        flexShrink: 0
                      }}
                    >
                      ⚠
                    </div>
                    <span style={{ 
                      fontSize: '15px', 
                      fontWeight: '500',
                      flex: 1 
                    }}>
                      {alert.message}
                    </span>
                    <button
                      onClick={hideAlert}
                      style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        border: 'none',
                        color: 'white',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        lineHeight: '1',
                        flexShrink: 0,
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
                      onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}

              <div className="auth-cards training">
                <p className="text-uppercase mb-5">Work Out</p>
                <h3 className="mb-2">
                  How often do you work <br /> out each week?
                </h3>
                <p>Personalizing Your Plan Based on Your Input</p>
                <form onSubmit={handleContinue}>
                  <h6>Training days</h6>
                  <div>
                    <ul className="days-list">
                      {WEEKDAYS.map((day, index) => {
                        const isSelected = selectedDays.includes(day);
                        return (
                          <li
                            key={day}
                            className={`days-list-items ${isSelected ? "active" : ""}`}
                            style={{ transitionDelay: `${index * 50}ms` }}
                          >
                            <input
                              type="checkbox"
                              className="d-none"
                              id={`day-${day}`}
                              name="training-days"
                              value={day}
                              checked={isSelected}
                              onChange={() => handleDaysChange(day)}
                            />
                            <label htmlFor={`day-${day}`}>
                              <span>{day}</span>
                            </label>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  <div className="text-center mt-5">
                    <button
                      type="submit"
                      className="custom-btn continue-btn"
                      disabled={!selectedDays || selectedDays.length < 1}
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

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </>
  );
}

export default trainingDayPage;