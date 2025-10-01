"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "../../../context/OnboardingContext";
import Alert from "../../../Components/Alert";

function FeedbackPage() {
  const router = useRouter();
  const { state, updateField, updateStep, isStepValid } = useOnboarding();
  const [feedback, setFeedback] = useState(state.feedback ?? null); // true/false
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  // Redirects based on previous steps
  useEffect(() => {
    if (state.isAuthChecked && state.isAuthenticated === false) {
      router.push("/register");
    } else if (!state.gender) {
      router.push("/select-gender");
    } else if (!state.dateOfBirth || state.age < 13) {
      router.push("/borndate");
    } else if (!state.trainingDay) {
      router.push("/training-days");
    } else if (state.trainMoreThanOnce === undefined) {
      router.push("/train-more");
    }
  }, [
    state.isAuthenticated,
    state.gender,
    state.dateOfBirth,
    state.age,
    state.trainingDay,
    state.trainMoreThanOnce,
    router,
  ]);

  // Set current step
  useEffect(() => {
    updateStep(6);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
  };

  const hideAlert = () => {
    setAlert({ show: false, type: "", message: "" });
  };

  const handleFeedbackChange = (value) => {
    setFeedback(value);
    updateField("feedback", value); // update immediately in context
    hideAlert();
  };

  const handleContinue = (e) => {
    e.preventDefault();

    if (feedback === null) {
      showAlert("warning", "Please select your feedback to continue.");
      return;
    }
    console.log("545454", isStepValid(6));

    if (isStepValid(6)) {
      updateStep(7);
      router.push("/new-weight"); // next page
    }
  };

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

            <div className="auth-cards feedback">
              <button type="button" className="new_back_btn">
                Previous
              </button>
              <p className="text-uppercase mb-3">Feedback</p>
              <h3 className="mb-2">
                Have you tracked your calories <br /> with other apps?
              </h3>
              <form onSubmit={handleContinue}>
                <div className="feedback-list">
                  <div className="feedback-bx">
                    <input
                      type="radio"
                      className="d-none"
                      id="unlike"
                      name="feedback"
                      checked={feedback === false}
                      onChange={() => handleFeedbackChange(false)}
                    />
                    <label htmlFor="unlike">
                      <div>
                        <img src="/images/unlike.svg" alt="No" />
                        <span className="d-block">No</span>
                      </div>
                    </label>
                  </div>
                  <div className="feedback-bx">
                    <input
                      type="radio"
                      className="d-none"
                      id="like"
                      name="feedback"
                      checked={feedback === true}
                      onChange={() => handleFeedbackChange(true)}
                    />
                    <label htmlFor="like">
                      <div>
                        <img src="/images/like.svg" alt="Yes" />
                        <span className="d-block">Yes</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="text-center mt-4">
                  <button
                    type="submit"
                    className="custom-btn continue-btn"
                    disabled={feedback === null}
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
  );
}

export default FeedbackPage;
