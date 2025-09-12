"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "../../../context/OnboardingContext";
import Alert from "../../../Components/Alert";

function PreferredDietPage() {
  const router = useRouter();
  const { state, updateField, updateStep, isStepValid } = useOnboarding();
  const [selectedDiet, setSelectedDiet] = useState(state.dietType || "");
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  // Redirect if not authenticated
  useEffect(() => {
    if (state.isAuthChecked && state.isAuthenticated === false) {
      router.push("/register");
    }
  }, [state.isAuthenticated, state.isAuthChecked, router]);

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

  const handleDietChange = (diet) => {
    setSelectedDiet(diet);
    updateField("dietType", diet); // update context immediately
    hideAlert();
  };

  const handleContinue = (e) => {
    e.preventDefault();

    if (!selectedDiet) {
      showAlert("warning", "Please select a diet type to continue.");
      return;
    }

    if (isStepValid(16)) {
      updateStep(17);
      router.push("/favorite-food");
    }
  };

  const options = [
    { id: "ANYTHING", label: "Anything" },
    { id: "KETO", label: "Keto" },
    { id: "MEDITERRANEAN", label: "Mediterranean" },
    { id: "PALEO", label: "Paleo" },
    { id: "VEGAN", label: "Vegan" },
    { id: "VEGETARIAN", label: "Vegetarian" },
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

            <div className="auth-cards preferre-diet">
              <p className="text-uppercase mb-2">Preferred Diet</p>
              <h3 className="mb-4">Do you have a preferred diet?</h3>
              <div className="px-135">
                <form onSubmit={handleContinue}>
                  {options.map((option) => (
                    <div className="custom-check" key={option.id}>
                      <input
                        type="radio"
                        id={option.id}
                        name="preferred-diet"
                        className="d-none"
                        value={option.id}
                        checked={selectedDiet === option.id}
                        onChange={() => handleDietChange(option.id)}
                      />
                      <label
                        htmlFor={option.id}
                        className={selectedDiet === option.id ? "selected" : ""}
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}

                  <div className="text-center mt-3">
                    <button
                      type="submit"
                      className="custom-btn continue-btn"
                      disabled={!selectedDiet}
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

export default PreferredDietPage;
