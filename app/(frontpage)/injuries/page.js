"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "../../../context/OnboardingContext";
import { apiService } from "../../../lib/api";
import Alert from "../../../Components/Alert";

function InjuriesPage() {
  const router = useRouter();
  const { state, updateField, updateStep, isStepValid } = useOnboarding();
  const [injuryList, setInjuryList] = useState([]);
  const [selectedInjuries, setSelectedInjuries] = useState([]);
  const [customInjury, setCustomInjury] = useState("");
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  useEffect(() => {
    if (state.currentStep !== 28) {
      updateStep(28);
    }
  }, [state.currentStep, updateStep]); 

  useEffect(() => {
    if (!state.isAuthChecked) return; // wait for auth check

    if (state.isAuthenticated === false) {
      router.push("/register");
      return;
    }
    // Note: dislikedFoodItems can be empty array, so we check if it exists
    if (state.dislikedFoodItems === undefined) {
      router.push("/dislikes");
      return;
    }

    // Only update step if it's not already set

  }, [
    state.isAuthChecked,
    state.isAuthenticated,
    state.dislikedFoodItems,
    state.currentStep,
    router,
    updateStep,
  ]);

  useEffect(() => {
    // Load previously selected injuries from context/localStorage
    if (state.injuries && state.injuries.length > 0) {
      // Separate predefined injuries from custom injuries
      const predefinedInjuries = [];
      let customInjury = "";
      
      state.injuries.forEach(injury => {
        // Check if this injury matches any of the fetched injuries
        // If not, it's likely a custom injury
        const isPredefined = injuryList.some(inj => inj.injury_name === injury);
        if (isPredefined || injuryList.length === 0) {
          // Include if it's predefined or if we haven't loaded injuries yet
          predefinedInjuries.push(injury);
        }
        // Comment out the old custom injury loading logic
        // else {
        //   // This is likely a custom injury
        //   customInjury = injury;
        // }
      });
      
      setSelectedInjuries(predefinedInjuries);
    }
    
    // Load custom injury from the new field
    if (state.injuries_other) {
      setCustomInjury(state.injuries_other);
    }
  }, [state.injuries, state.injuries_other, injuryList]);

  useEffect(() => {
    fetchInjuries();
  }, []);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
  };

  const hideAlert = () => {
    setAlert({ show: false, type: "", message: "" });
  };

  const fetchInjuries = async () => {
    setLoading(true);
    hideAlert();

    try {
      const response = await apiService.getInjuries();

      if (response.success) {
        const apiInjuries = response.result || [];
        // Only set API injuries, don't add custom ones to the list
        setInjuryList(apiInjuries);
      } else {
        showAlert("error", "Failed to load injuries. Please try again.");
      }
    } catch (error) {
      console.error("Injuries fetch error:", error);
      showAlert(
        "error",
        "Failed to load injuries. Please check your internet connection."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInjuryToggle = (injuryName) => {
    setSelectedInjuries((prev) => {
      const newSelection = prev.includes(injuryName)
        ? prev.filter((name) => name !== injuryName)
        : [...prev, injuryName];

      updateField("injuries", newSelection);
      return newSelection;
    });
    hideAlert();
  };

  // Handle custom injury input changes
  const handleCustomInjuryChange = (e) => {
    const value = e.target.value;
    setCustomInjury(value);
    // Store the input value in context immediately
    updateField("injuries_other", value);
  };

  const handleRemoveInjury = (injuryName) => {
    const newSelection = selectedInjuries.filter((name) => name !== injuryName);
    setSelectedInjuries(newSelection);
    updateField("injuries", newSelection);
  };

  const handleContinue = (e) => {
    e.preventDefault();

    // Update the onboarding context with selected injuries and custom input separately
    updateField("injuries", selectedInjuries);
    updateField("injuries_other", customInjury.trim());


    if(selectedInjuries.length>0||customInjury.trim()){
      router.push("/crash-goal");
    }
    

    // router.push("/crash-goal");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // Don't add to list automatically, just save the input value
      // User can manually select/add items if needed
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

              <div className="auth-cards food">
                <p className="text-uppercase mb-2">Injuries</p>
                <h3 className="mb-4">
                  Do you have any past injuries <br /> or movement limitations?
                </h3>

                {loading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">
                        Loading injuries...
                      </span>
                    </div>
                    <p className="mt-2">Loading available injuries...</p>
                  </div>
                ) : (
                  <>
                    <div className="food-list">
                      <div className="food-card">
                        {injuryList.map((injury) => (
                          <div key={injury.id} className="food-bx">
                            <input
                              type="checkbox"
                              className="d-none"
                              id={`injury-${injury.id}`}
                              checked={selectedInjuries.includes(
                                injury.injury_name
                              )}
                              onChange={() =>
                                handleInjuryToggle(injury.injury_name)
                              }
                            />
                            <label
                              htmlFor={`injury-${injury.id}`}
                              className={
                                selectedInjuries.includes(injury.injury_name)
                                  ? "selected"
                                  : ""
                              }
                            >
                              {injury.injury_name}
                              {selectedInjuries.includes(
                                injury.injury_name
                              ) && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleRemoveInjury(injury.injury_name);
                                  }}
                                >
                                  <img src="/images/close.svg" alt="Remove" />
                                </button>
                              )}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="custom-frm-bx mt-4 px-135">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="If other (please specify)"
                        value={customInjury}
                        onChange={handleCustomInjuryChange}
                        onKeyPress={handleKeyPress}
                      />
                    </div>

                    {injuryList.length === 0 && !loading && (
                      <div className="text-center py-4">
                        <p>No injuries available at the moment.</p>
                      </div>
                    )}
                  </>
                )}

                <div className="text-center mt-3">
                  <button
                    onClick={handleContinue}
                    className="custom-btn continue-btn"
                    disabled={loading}
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

export default InjuriesPage;
