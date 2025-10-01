"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "../../../context/OnboardingContext";
import Alert from "../../../Components/Alert";

function trainingDayPage() {
  const router = useRouter();
  const { state, updateField, updateStep, isStepValid } = useOnboarding();
  const [selectedDays, setSelectedDays] = useState(state.trainingDays || []);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  // Redirects based on previous steps
  useEffect(() => {
    if (state.isAuthChecked && state.isAuthenticated === false) {
      router.push("/register");
    } else if (!state.gender) {
      router.push("/select-gender");
    } else if (!state.dateOfBirth || state.age < 13) {
      router.push("/borndate");
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
    setAlert({ show: false, type: "", message: "" });
  };

  const handleDaysChange = (day) => {
    let updatedDays;

    if (selectedDays.includes(day)) {
      updatedDays = selectedDays.filter((d) => d !== day);
    } else {
      if (selectedDays.length >= 6) {
        return; // Prevent adding more than 6
      }
      updatedDays = [...selectedDays, day];
    }

    setSelectedDays(updatedDays);
    updateField("trainingDays", updatedDays);
    updateField("trainingDay", updatedDays.length);
    hideAlert();
  };

  const handleContinue = (e) => {
    e.preventDefault();

    if (!selectedDays || selectedDays.length < 1) {
      showAlert(
        "warning",
        "Please select at least one day per week you can train."
      );
      return;
    }

    if (isStepValid(4)) {
      updateStep(5);
      router.push("/train-more");
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
                <button type="button" className="new_back_btn">
                  Previous
                </button>
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
                            className={`days-list-items ${
                              isSelected ? "active" : ""
                            }`}
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
                    {/* Counter Display */}
                    <div className="text-center mt-3">
                      <p className="text-muted mb-0">
                        <span style={{ fontSize: '16px', fontWeight: '500' }}>
                          {selectedDays.length}/6
                        </span>
                        <span style={{ fontSize: '14px', marginLeft: '8px' }}>
                          days selected
                        </span>
                      </p>
                    </div>
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
    </>
  );
}

export default trainingDayPage;