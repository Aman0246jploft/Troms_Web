"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "../../../context/OnboardingContext";
import { apiService } from "../../../lib/api";

function HealthConditionsPage() {
  const router = useRouter();
  const { state, updateField, updateStep } = useOnboarding();
  const [healthConditions, setHealthConditions] = useState([]);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [otherCondition, setOtherCondition] = useState("");
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   // Load previously selected conditions from context/localStorage
  //   if (state.healthyConditions && state.healthyConditions.length > 0) {
  //     // Separate predefined conditions from custom "Other" conditions
  //     const predefinedConditions = [];
  //     let customCondition = "";

  //     state.healthyConditions.forEach((condition) => {
  //       // Check if this condition matches any of the fetched health conditions
  //       // If not, it's likely a custom "Other" condition
  //       const isPredefined = healthConditions.some(
  //         (hc) => hc.title === condition
  //       );
  //       if (isPredefined || healthConditions.length === 0) {
  //         // Include if it's predefined or if we haven't loaded conditions yet
  //         predefinedConditions.push(condition);
  //       } else {
  //         // This is likely a custom condition
  //         customCondition = condition;
  //       }
  //     });

  //     setSelectedConditions(predefinedConditions);
  //     if (customCondition) {
  //       setOtherCondition(customCondition);
  //     }
  //   }
  // }, [state.healthyConditions, healthConditions]);



useEffect(() => {
  if (state.healthyConditions && state.healthyConditions.length > 0) {
    const predefinedConditions = [];
    let customCondition = "";

    state.healthyConditions.forEach((condition) => {
      // Check if this condition exists in fetched healthConditions
      const isPredefined = healthConditions.some(
        (hc) => hc.title === condition
      ) || condition === HEALTHY_OPTION; // include "Healthy" as predefined

      if (isPredefined) {
        predefinedConditions.push(condition);
      } else {
        // Custom condition goes to Other field
        customCondition = condition;
      }
    });

    setSelectedConditions(predefinedConditions);
    setOtherCondition(customCondition);
  }
}, [state.healthyConditions, healthConditions]);


  useEffect(() => {
    fetchHealthConditions();
  }, []);

  useEffect(() => {
    if (state.currentStep !== 20) {
      updateStep(21);
    }
  }, []);

  const fetchHealthConditions = async () => {
    try {
      setLoading(true);
      const response = await apiService.getHealthyConditions();
      if (response.success) {
        setHealthConditions(response.result);
      }
    } catch (error) {
      console.error("Error fetching health conditions:", error);
    } finally {
      setLoading(false);
    }
  };

  const HEALTHY_OPTION = "Healthy";

  // const handleConditionToggle = (conditionTitle) => {
  //   setSelectedConditions((prev) => {
  //     // If user selects "Healthy", deselect all others
  //     if (conditionTitle === HEALTHY_OPTION) {
  //       return prev.includes(HEALTHY_OPTION) ? [] : [HEALTHY_OPTION];
  //     }

  //     // If "Healthy" was selected and user selects another condition, remove "Healthy"
  //     let updated = prev.includes(conditionTitle)
  //       ? prev.filter((item) => item !== conditionTitle)
  //       : [...prev.filter((item) => item !== HEALTHY_OPTION), conditionTitle];

  //     return updated;
  //   });
  // };

const handleConditionToggle = (conditionTitle) => {
  setSelectedConditions((prev) => {
    if (conditionTitle === HEALTHY_OPTION) {
      // Selecting Healthy deselects all others including Other
      setOtherCondition(""); // Clear Other input
      return prev.includes(HEALTHY_OPTION) ? [] : [HEALTHY_OPTION];
    }

    // Selecting another condition deselects Healthy if it was selected
    let updated = prev.includes(conditionTitle)
      ? prev.filter((item) => item !== conditionTitle)
      : [...prev.filter((item) => item !== HEALTHY_OPTION), conditionTitle];

    return updated;
  });
};


  const handleContinue = () => {
    const finalConditions = [...selectedConditions];

    // Add "Other" condition if specified
    if (otherCondition.trim()) {
      finalConditions.push(otherCondition.trim());
    }

    // Update the onboarding context
    updateField("healthyConditions", finalConditions);

    // Update step and navigate to next step
    // updateStep(22);
    // router.push("/choose-country");
     updateStep(23);
    router.push("/budget");
  };
  // 

  if (loading) {
    return (
      <section className="auth-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-7">
              <div className="text-center">Loading health conditions...</div>
            </div>
          </div>
        </div>
      </section>
    );
  }

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
              <div className="auth-cards health-conditions">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="new_back_btn"
                >
                  Previous
                </button>
                <p className="text-uppercase mb-2">Health Conditions</p>
                <h3 className="mb-4">Common Health Conditions for Fitness</h3>
                <div className="food-card">



                  {healthConditions.map((condition) => (
                    <div key={condition.id} className="food-bx">
                      <input
                        type="checkbox"
                        id={`condition-${condition.id}`}
                        className="d-none"
                        checked={selectedConditions.includes(condition.title)}
                        onChange={() => handleConditionToggle(condition.title)}
                      />
                      <label htmlFor={`condition-${condition.id}`}>
                        {condition.title}
                        {condition.desc && (
                          <button type="button" className="tooltip-btn">
                            <img alt="info" src="/images/info-icon.svg" />
                            <span className="tooltip-text">
                              {condition.desc}
                            </span>
                          </button>
                        )}
                      </label>
                    </div>
                  ))}
                  <div className="food-bx">
                    <input
                      type="checkbox"
                      id="condition-healthy"
                      className="d-none"
                      checked={selectedConditions.includes(HEALTHY_OPTION)}
                      onChange={() => handleConditionToggle(HEALTHY_OPTION)}
                    />
                    <label htmlFor="condition-healthy">
                      {HEALTHY_OPTION}
                      <button type="button" className="tooltip-btn">
                        <img alt="info" src="/images/info-icon.svg" />
                        <span className="tooltip-text">
                          This option indicates that you are in good health and do not have any specific conditions.
                        </span>
                      </button>
                    </label>
                  </div>



                  <div className="food-bx">
                    <input
                      type="checkbox"
                      id="other-condition"
                      className="d-none"
                      checked={otherCondition.trim() !== ""}
                      onChange={() => {
                        if (otherCondition.trim() === "") {
                          // Focus the text input when checking "Other"
                          setTimeout(() => {
                            const otherInput = document.querySelector(
                              'input[placeholder="If other (please specify)"]'
                            );
                            if (otherInput) otherInput.focus();
                          }, 100);
                        } else {
                          setOtherCondition("");
                        }
                      }}
                    />
                    {/* <label htmlFor="other-condition">
                      Other
                      <button type="button">
                        <img alt="info" src="/images/info-icon.svg" />
                      </button>
                    </label> */}
                  </div>
                </div>
                {/* <div className="custom-frm-bx mt-4 px-135">
                  <input
                    className="form-control"
                    placeholder="If other (please specify)"
                    type="text"
                    value={otherCondition}
                    onChange={(e) => setOtherCondition(e.target.value)}
                  />
                </div> */}

<div className="custom-frm-bx mt-4 px-135">
  <input
    className="form-control"
    placeholder="If other (please specify)"
    type="text"
    value={otherCondition}
    onChange={(e) => {
      const value = e.target.value;
      setOtherCondition(value);

      // Deselect Healthy if user starts typing
      if (value.trim() !== "" && selectedConditions.includes(HEALTHY_OPTION)) {
        setSelectedConditions((prev) =>
          prev.filter((c) => c !== HEALTHY_OPTION)
        );
      }
    }}
  />
</div>

                
                <div className="text-center mt-3">
                  <button
                    type="button"
                    className="custom-btn continue-btn"
                    onClick={handleContinue}
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

export default HealthConditionsPage;
