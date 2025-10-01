"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "../../../context/OnboardingContext";
import Alert from "../../../Components/Alert";

function BudgetPage() {
  const router = useRouter();
  const { state, updateField, updateStep } = useOnboarding();
  const [selectedBudget, setSelectedBudget] = useState(state.budget || "");
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  const budgetOptions = [
    { id: "LOW", label: "Low", icon: "/images/low-icon.svg" },
    { id: "MEDIUM", label: "Medium", icon: "/images/medium-icon.svg" },
    { id: "HIGH", label: "High", icon: "/images/high-icon.svg" },
  ];

  // Set the step for country selection (adding as step 2 after registration)
  useEffect(() => {
    if (state.currentStep !== 22) {
      updateStep(23);
    }
  }, []);

  useEffect(() => {
    if (!state.isAuthChecked) return; // wait for auth check

    if (state.isAuthenticated === false) {
      router.push("/register");
      return;
    }
    if (!state.selectedCountry || !state.selectedCity) {
      router.push("/choose-country");
      return;
    }

    // Update step if needed
  }, [
    state.isAuthChecked,
    state.isAuthenticated,
    state.selectedCountry,
    state.selectedCity,
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

  const handleBudgetChange = (budgetId) => {
    setSelectedBudget(budgetId);
    updateField("budget", budgetId);
    hideAlert();
  };

  const handleContinue = (e) => {
    e.preventDefault();

    if (!selectedBudget) {
      showAlert("warning", "Please select your preferred budget.");
      return;
    }

    updateStep(24);
    router.push("/job-type");
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
                <button type="button" className="new_back_btn">
                  Previous
                </button>
                <p className="text-uppercase mb-2">Budget</p>
                <h3 className="mb-4">Select your preferred budget.</h3>
                <form onSubmit={handleContinue}>
                  <div className="px-135">
                    {budgetOptions.map((option) => (
                      <div
                        key={option.id}
                        className="custom-check budget-check"
                      >
                        <input
                          id={option.id}
                          className="d-none"
                          type="radio"
                          name="budget"
                          value={option.id}
                          checked={selectedBudget === option.id}
                          onChange={() => handleBudgetChange(option.id)}
                        />
                        <label
                          htmlFor={option.id}
                          className={
                            selectedBudget === option.id ? "selected" : ""
                          }
                        >
                          <img
                            src={option.icon}
                            alt={`${option.label} Budget`}
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
                      disabled={!selectedBudget}
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

export default BudgetPage;
