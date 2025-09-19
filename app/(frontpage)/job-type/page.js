"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "../../../context/OnboardingContext";
import { apiService } from "../../../lib/api";
import Alert from "../../../Components/Alert";

function JobTypePage() {
  const router = useRouter();
  const { state, updateField, updateStep, isStepValid } = useOnboarding();
  const [occupations, setOccupations] = useState([]);
  const [selectedOccupation, setSelectedOccupation] = useState(state.occupation || "");
  const [customOccupation, setCustomOccupation] = useState("");
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });


  useEffect(() => {
    if (state.currentStep !== 23) {
      updateStep(24);
    }
  }, []); 

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

    // Update step if needed
  
  }, [
    state.isAuthChecked,
    state.isAuthenticated,
    state.budget,
    state.currentStep,
    router,
    updateStep,
  ]);

  useEffect(() => {
    fetchOccupations();
  }, []);

  // Load existing occupation when component mounts and occupations are loaded
  useEffect(() => {
    if (state.occupation && occupations.length > 0) {
      const predefinedOccupation = occupations.find(occ => occ.title === state.occupation);
      if (predefinedOccupation) {
        // It's a predefined occupation
        setSelectedOccupation(state.occupation);
        setCustomOccupation("");
      } else {
        // It's a custom occupation
        setSelectedOccupation("Other");
        setCustomOccupation(state.occupation);
      }
    } else if (state.occupation && occupations.length === 0) {
      // If we have an occupation but no API occupations loaded yet, assume it's custom
      setSelectedOccupation("Other");
      setCustomOccupation(state.occupation);
    }
  }, [state.occupation, occupations]);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
  };

  const hideAlert = () => {
    setAlert({ show: false, type: "", message: "" });
  };

  const fetchOccupations = async () => {
    setLoading(true);
    hideAlert();

    try {
      const response = await apiService.getOccupations();

      if (response.success) {
        setOccupations(response.result || []);
      } else {
        showAlert("error", "Failed to load occupations. Please try again.");
      }
    } catch (error) {
      console.error("Occupations fetch error:", error);
      showAlert(
        "error",
        "Failed to load occupations. Please check your internet connection."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOccupationSelect = (occupationTitle) => {
    setSelectedOccupation(occupationTitle);
    setCustomOccupation(""); // Clear custom input when selecting predefined option
    updateField("occupation", occupationTitle);
    hideAlert();
  };

  const handleCustomOccupationChange = (e) => {
    const value = e.target.value;
    setCustomOccupation(value);
    if (value.trim()) {
      setSelectedOccupation(value.trim());
      updateField("occupation", value.trim());
    } else {
      setSelectedOccupation("");
      updateField("occupation", "");
    }
    hideAlert();
  };

  const handleOtherSelect = () => {
    setSelectedOccupation("Other");
    // Clear any predefined selection to focus on custom input
    updateField("occupation", "");
    // Focus the input field if possible
    setTimeout(() => {
      const customInput = document.querySelector('input[placeholder="If other (please specify)"]');
      if (customInput) customInput.focus();
    }, 100);
  };

  const handleContinue = (e) => {
    e.preventDefault();

    const finalOccupation = customOccupation.trim() || selectedOccupation;
    
    if (!finalOccupation) {
      showAlert("warning", "Please select your occupation or enter a custom occupation.");
      return;
    }

    // Update with final occupation value
    updateField("occupation", finalOccupation);

    if (isStepValid(24)) {
      updateStep(25);
      router.push("/moveAtwork");
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

              <div className="auth-cards goal">
                <p className="text-uppercase mb-2">Job Type</p>
                <h3 className="mb-4">What is your occupation?</h3>

                {loading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading occupations...</span>
                    </div>
                    <p className="mt-2">Loading available occupations...</p>
                  </div>
                ) : (
                  <>
                    <div className="food-list">
                      <div className="food-card">
                        {occupations.map((occupation) => (
                          <div key={occupation.id} className="food-bx">
                            <input
                              type="radio"
                              className="d-none"
                              id={`occupation-${occupation.id}`}
                              name="occupation"
                              checked={selectedOccupation === occupation.title && !customOccupation.trim()}
                              onChange={() => handleOccupationSelect(occupation.title)}
                            />
                            <label
                              htmlFor={`occupation-${occupation.id}`}
                              className={
                                selectedOccupation === occupation.title && !customOccupation.trim() ? "selected" : ""
                              }
                            >
                              {occupation.title}
                            </label>
                          </div>
                        ))}
                        
                        {/* Other option */}
                        <div className="food-bx">
                          <input
                            type="radio"
                            className="d-none"
                            id="occupation-other"
                            name="occupation"
                            checked={selectedOccupation === "Other" || customOccupation.trim() !== ""}
                            onChange={handleOtherSelect}
                          />
                          <label
                            htmlFor="occupation-other"
                            className={
                              selectedOccupation === "Other" || customOccupation.trim() !== "" ? "selected" : ""
                            }
                          >
                            Other
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Custom input field */}
                    <div className="custom-frm-bx mt-4 px-135">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="If other (please specify)"
                        value={customOccupation}
                        onChange={handleCustomOccupationChange}
                      />
                    </div>

                    {occupations.length === 0 && !loading && (
                      <div className="text-center py-4">
                        <p>No occupations available at the moment.</p>
                      </div>
                    )}
                  </>
                )}

                <div className="text-center mt-3">
                  <button
                    onClick={handleContinue}
                    className="custom-btn continue-btn"
                    disabled={loading || (!selectedOccupation && !customOccupation.trim())}
                  >
                    Continue
                  </button>
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

export default JobTypePage;