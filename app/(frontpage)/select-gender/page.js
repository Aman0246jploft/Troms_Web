"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "../../../context/OnboardingContext";
import Alert from "../../../Components/Alert";

function SelectGenderPage() {
  const router = useRouter();
  const { state, updateField, updateStep, isStepValid } = useOnboarding();
  const [selectedGender, setSelectedGender] = useState(state.gender);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  useEffect(() => {
    // Redirect if not authenticated
    if (state.isAuthChecked && state.isAuthenticated === false) {
      router.push("/register");
      return;
    }

    // Redirect if onboarding is not needed
    if (!state.needsOnboarding) {
      router.push("/bmr");
      return;
    }

    // Update step once on mount
    updateStep(2);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // empty dependency array ensures this runs only once

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
  };

  const hideAlert = () => {
    setAlert({ show: false, type: "", message: "" });
  };

  const handleGenderChange = (gender) => {
    setSelectedGender(gender);
    updateField("gender", gender);
  };

  const handleContinue = (e) => {
    e.preventDefault();

    if (!selectedGender) {
      showAlert("warning", "Please select your gender to continue.");
      return;
    }

    if (isStepValid(2)) {
      updateStep(3);
      router.push("/borndate");
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

              <div className="auth-cards gender">
                <p className="text-uppercase mb-5">Your Gender</p>
                <h3 className="mb-2">Share a bit about who you are</h3>
                <p>To enhance your experience, please share your gender.</p>
                <form onSubmit={handleContinue}>
                  <div className="gender-cards">
                    <div>
                      <input
                        type="radio"
                        id="male"
                        className="d-none"
                        name="gender"
                        value="male"
                        checked={selectedGender === "male"}
                        onChange={() => handleGenderChange("male")}
                      />
                      <label
                        htmlFor="male"
                        className={selectedGender === "male" ? "selected" : ""}
                      >
                        <div className="gender-img">
                          <img src="/images/male.png" alt="Male" />
                        </div>
                        Male
                      </label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        id="female"
                        className="d-none"
                        name="gender"
                        value="female"
                        checked={selectedGender === "female"}
                        onChange={() => handleGenderChange("female")}
                      />
                      <label
                        htmlFor="female"
                        className={
                          selectedGender === "female" ? "selected" : ""
                        }
                      >
                        <div className="gender-img">
                          <img src="/images/female.png" alt="Female" />
                        </div>
                        Female
                      </label>
                    </div>
                  </div>
                  <div className="text-center">
                    <button
                      type="submit"
                      className="custom-btn continue-btn"
                      disabled={!selectedGender}
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

export default SelectGenderPage;
