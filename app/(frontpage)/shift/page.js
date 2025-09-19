"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "../../../context/OnboardingContext";
import Alert from "../../../Components/Alert";

function ShiftPage() {
  const router = useRouter();
  const { state, updateField, updateStep } = useOnboarding();
  const [selectedShift, setSelectedShift] = useState(state.workShift || "");
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  const shiftOptions = [
    { id: "DAY", label: "Day", icon: "/images/low-icon.svg" },
    { id: "NIGHT", label: "Night", icon: "/images/medium-icon.svg" },
    { id: "ROTATING_SHIFTS", label: "Rotating shifts", icon: "/images/high-icon.svg" },
    { id: "VARIES", label: "Varies", icon: "/images/high-icon.svg" },
  ];

  useEffect(() => {
    if (state.currentStep !== 25) {
      updateStep(26);
    }
  }, [state.currentStep]); 

  useEffect(() => {
    if (!state.isAuthChecked) return; // wait for auth check

    if (state.isAuthenticated === false) {
      router.push("/register");
      return;
    }
    if (!state.budget) {
      router.push("/budget");
      return;
    }
    if (!state.occupation) {
      router.push("/job-type");
      return;
    }
    if (!state.workActivityLevel) {
      router.push("/moveAtwork");
      return;
    }


  }, [
    state.isAuthChecked,
    state.isAuthenticated,
    state.budget,
    state.occupation,
    state.workActivityLevel,
    state.currentStep,
    router,
    updateStep,
  ]);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
  };

  const hideAlert = () => {
    setAlert({ show: false, type: "", message: "" });
  };

  const handleShiftChange = (shiftId) => {
    setSelectedShift(shiftId);
    updateField("workShift", shiftId);
    hideAlert();
  };

  const handleContinue = (e) => {
    e.preventDefault();

    if (!selectedShift) {
      showAlert("warning", "Please select when you work.");
      return;
    }

    router.push("/allergies"); // Continue with existing flow
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

              <div className="auth-cards">
                <p className="text-uppercase mb-2">Shift</p>
                <h3 className="mb-4">When do you work?</h3>
                <form onSubmit={handleContinue}>
                  <div className="px-135">
                    {shiftOptions.map((option) => (
                      <div key={option.id} className="custom-check budget-check">
                        <input
                          id={option.id}
                          className="d-none"
                          type="radio"
                          name="shift"
                          value={option.id}
                          checked={selectedShift === option.id}
                          onChange={() => handleShiftChange(option.id)}
                        />
                        <label 
                          htmlFor={option.id} 
                          className={selectedShift === option.id ? "selected" : ""}
                        >
                          <img src={option.icon} alt={`${option.label} Shift`} />{" "}
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="text-center mt-3">
                    <button 
                      type="submit" 
                      className="custom-btn continue-btn"
                      disabled={!selectedShift}
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

export default ShiftPage;
