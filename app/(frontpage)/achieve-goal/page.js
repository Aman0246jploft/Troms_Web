"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "../../../context/OnboardingContext";
import Alert from "../../../Components/Alert";

function ReachingGoalsPage() {
  const router = useRouter();
  const { state, updateField, updateStep, isStepValid } = useOnboarding();
  const [selectedGoalReason, setSelectedGoalReason] = useState(
    state.reachingGoals || ""
  );
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  // Redirects if previous steps not completed
  useEffect(() => {
    if (state.isAuthChecked && state.isAuthenticated === false) {
      router.push("/register");
    }
  }, [state.isAuthenticated]);

  // Set current step
  useEffect(() => {
    updateStep(16);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
  };

  const hideAlert = () => {
    setAlert({ show: false, type: "", message: "" });
  };

  const handleGoalReasonChange = (reason) => {
    setSelectedGoalReason(reason);
    updateField("reachingGoals", reason); // immediate update
    hideAlert();
  };

  const handleContinue = (e) => {
    e.preventDefault();

    if (!selectedGoalReason) {
      showAlert("warning", "Please select a reason to continue.");
      return;
    }

    if (isStepValid(16)) {
      updateStep(17);
      router.push("/preferred-diet");
    }
  };

  const options = [
    { id: "Absence of regularity", label: "Absence of regularity" },
    { id: "Unhealthy eating habits", label: "Unhealthy eating habits" },
    { id: "Lack of motivation", label: "Lack of motivation" },
    { id: "Too busy", label: "Too busy" },
  ];

  return (
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
                  <button
      type="button"
      onClick={() => router.back()}
      className="new_back_btn"
    >
                Previous
              </button>
              <p className="text-uppercase mb-3">Reaching your Goals</p>
              <h3 className="mb-4">
                What's preventing you from <br /> achieving your goals?
              </h3>
              <div className="px-135">
                <form onSubmit={handleContinue}>
                  {options.map((option) => (
                    <div className="custom-check" key={option.id}>
                      <input
                        type="radio"
                        id={option.id}
                        name="achieving-goal"
                        className="d-none"
                        value={option.id}
                        checked={selectedGoalReason === option.id}
                        onChange={() => handleGoalReasonChange(option.id)}
                      />
                      <label
                        htmlFor={option.id}
                        className={
                          selectedGoalReason === option.id ? "selected" : ""
                        }
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}

                  <div className="text-center mt-3">
                    <button
                      type="submit"
                      className="custom-btn continue-btn"
                      disabled={!selectedGoalReason}
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
  );
}

export default ReachingGoalsPage;
