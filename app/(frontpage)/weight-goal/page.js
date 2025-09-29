"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "../../../context/OnboardingContext";
import Alert from "../../../Components/Alert";

function WeightGoalPage() {
  const router = useRouter();
  const { state, updateField, updateStep, isStepValid } = useOnboarding();
  const [selectedGoal, setSelectedGoal] = useState(state.weightGoal || "");
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  useEffect(() => {
    if (state.isAuthChecked && state.isAuthenticated === false) {
      router.push("/register");
    } else if (!state.weight || state.weight <= 0) {
      router.push("/new-height");
    }
  }, [state.isAuthenticated, state.weight, router]);

  // Set current step
  useEffect(() => {
    updateStep(9);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
  };

  const hideAlert = () => {
    setAlert({ show: false, type: "", message: "" });
  };

  const handleGoalChange = (goal) => {
    setSelectedGoal(goal);
    updateField("weightGoal", goal);
    hideAlert();
  };

  const handleContinue = (e) => {
    e.preventDefault();

    if (!selectedGoal) {
      showAlert("warning", "Please select your weight goal to continue.");
      return;
    }

    if (isStepValid(9)) {
      // If user selects MAINTAIN, skip the desired weight step
      if (selectedGoal === "MAINTAIN") {
        // Set desired weight equal to current weight for maintenance
        updateField("desiredWeight", state.weight);
        updateStep(11); // Skip step 10 (desired weight) and go to step 11 (workout location)
        router.push("/workout-location");
      } else {
        // For LOSE_WEIGHT and GAIN_WEIGHT, go to desired weight step
        updateStep(10);
        router.push("/new-desired-weight");
      }
    }
  };

  const getGoalDescription = () => {
    switch (selectedGoal) {
      case "LOSE_WEIGHT":
        return "You'll need to consume fewer calories than you burn to lose weight.";
      case "MAINTAIN":
        return "You'll maintain your current weight by balancing calories in and out.";
      case "GAIN_WEIGHT":
        return "You'll need to consume more calories than you burn to gain weight.";
      default:
        return "Select your goal to see personalized recommendations.";
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
                <p className="text-uppercase mb-5">Weight Goal</p>
                <h3 className="mb-2">What is your goal?</h3>
                <p>Adjusting Your Calorie Intake for Optimal Performance</p>
                <div className="px-135">
                  <form onSubmit={handleContinue}>
                    <div className="custom-check">
                      <input
                        type="radio"
                        id="lose"
                        name="weight-goal"
                        className="d-none"
                        value="LOSE_WEIGHT"
                        checked={selectedGoal === "LOSE_WEIGHT"}
                        onChange={() => handleGoalChange("LOSE_WEIGHT")}
                      />
                      <label
                        htmlFor="lose"
                        className={
                          selectedGoal === "LOSE_WEIGHT" ? "selected" : ""
                        }
                      >
                        Lose Weight
                      </label>
                    </div>
                    <div className="custom-check">
                      <input
                        type="radio"
                        id="maintain"
                        name="weight-goal"
                        className="d-none"
                        value="MAINTAIN"
                        checked={selectedGoal === "MAINTAIN"}
                        onChange={() => handleGoalChange("MAINTAIN")}
                      />
                      <label
                        htmlFor="maintain"
                        className={
                          selectedGoal === "MAINTAIN" ? "selected" : ""
                        }
                      >
                        Maintain
                      </label>
                    </div>
                    <div className="custom-check">
                      <input
                        type="radio"
                        id="gain"
                        name="weight-goal"
                        className="d-none"
                        value="GAIN_WEIGHT"
                        checked={selectedGoal === "GAIN_WEIGHT"}
                        onChange={() => handleGoalChange("GAIN_WEIGHT")}
                      />
                      <label
                        htmlFor="gain"
                        className={
                          selectedGoal === "GAIN_WEIGHT" ? "selected" : ""
                        }
                      >
                        Gain Weight
                      </label>
                    </div>

                    {/* {selectedGoal && (
                      <div className="mt-4 p-3 bg-light rounded">
                        <p className="mb-0 text-center">
                          <strong>Goal:</strong> {selectedGoal.replace('_', ' ')}
                        </p>
                        <p className="mb-0 text-center small text-muted">
                          {getGoalDescription()}
                        </p>
                      </div>
                    )} */}

                    <div className="text-center mt-5">
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

export default WeightGoalPage;
