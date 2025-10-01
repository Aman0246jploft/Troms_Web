"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "../../../context/OnboardingContext";
import Alert from "../../../Components/Alert";

function MoveAtwork() {
  const router = useRouter();
  const { state, updateField, updateStep } = useOnboarding();
  const [selectedActivityLevel, setSelectedActivityLevel] = useState(
    state.workActivityLevel || ""
  );
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  const activityOptions = [
    { id: "MOSTLY_SIT", label: "Mostly sit", icon: "/images/low-icon.svg" },
    {
      id: "SIT_AND_STAND",
      label: "Sit & stand",
      icon: "/images/medium-icon.svg",
    },
    {
      id: "ON_FEET_MOST_OF_THE_TIME",
      label: "On feet most of the time",
      icon: "/images/high-icon.svg",
    },
    {
      id: "HEAVY_LIFTING",
      label: "Heavy lifting",
      icon: "/images/high-icon.svg",
    },
  ];

  useEffect(() => {
    if (state.currentStep !== 24) {
      updateStep(25);
    }
  }, []);

  useEffect(() => {
    if (!state.isAuthChecked) return;

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

    // // Update step if needed
    // if (state.currentStep !== 24) {
    //   updateStep(24);
    // }
  }, [
    state.isAuthChecked,
    state.isAuthenticated,
    state.budget,
    state.occupation,
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

  const handleActivityLevelChange = (activityId) => {
    setSelectedActivityLevel(activityId);
    updateField("workActivityLevel", activityId);
    hideAlert();
  };

  const handleContinue = (e) => {
    e.preventDefault();

    if (!selectedActivityLevel) {
      showAlert("warning", "Please select your work activity level.");
      return;
    }

    // updateStep(25);
    router.push("/shift"); // Continue to shift page
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
                    <button
      type="button"
      onClick={() => router.back()}
      className="new_back_btn"
    >
                  Previous
                </button>
                <p className="text-uppercase mb-2">Movement</p>
                <h3 className="mb-4">How much do you move at work?</h3>
                <form onSubmit={handleContinue}>
                  <div className="px-135">
                    {activityOptions.map((option) => (
                      <div
                        key={option.id}
                        className="custom-check budget-check"
                      >
                        <input
                          id={option.id}
                          className="d-none"
                          type="radio"
                          name="activityLevel"
                          value={option.id}
                          checked={selectedActivityLevel === option.id}
                          onChange={() => handleActivityLevelChange(option.id)}
                        />
                        <label
                          htmlFor={option.id}
                          className={
                            selectedActivityLevel === option.id
                              ? "selected"
                              : ""
                          }
                        >
                          <img
                            src={option.icon}
                            alt={`${option.label} Activity`}
                          />{" "}
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="text-center mt-3">
                    <button
                      type="submit"
                      className="custom-btn continue-btn"
                      disabled={!selectedActivityLevel}
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

export default MoveAtwork;
