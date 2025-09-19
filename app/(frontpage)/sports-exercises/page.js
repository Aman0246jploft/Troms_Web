"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "../../../context/OnboardingContext";
import Alert from "../../../Components/Alert";

function SportsExercisesContent() {
  const router = useRouter();
  const { state, updateField, updateStep, isStepValid } = useOnboarding();
  const [sportExercises, setSportExercises] = useState([]);
  const [customExercise, setCustomExercise] = useState("");
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  // Predefined sports/exercises options
  const exerciseOptions = [
    "Running","Swimming" ,"Walking", "Cycling",, "Yoga", "Pilates", 
     "Cardio", "CrossFit", "Basketball", "Football", 
    "Tennis", "Badminton", "Boxing", 
  ];

  useEffect(() => {
    if (state.isAuthChecked && state.isAuthenticated === false) {
      router.push("/register");
    }
  }, [state.isAuthenticated, router]);

  useEffect(() => {
    updateStep(13);
  }, []);

  useEffect(() => {
    // Load previously selected exercises from context/localStorage
    if (state.sportExercises && state.sportExercises.length > 0) {
      // Separate predefined exercises from custom "Other" exercises
      const predefinedExercises = [];
      let customExerciseValue = "";
      
      state.sportExercises.forEach(exercise => {
        // Check if this exercise matches any of the predefined exercise options
        const isPredefined = exerciseOptions.includes(exercise);
        if (isPredefined) {
          predefinedExercises.push(exercise);
        } else {
          // This is likely a custom exercise
          customExerciseValue = exercise;
        }
      });
      
      setSportExercises(predefinedExercises);
      if (customExerciseValue) {
        setCustomExercise(customExerciseValue);
      }
    }
  }, [state.sportExercises]);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
  };

  const hideAlert = () => {
    setAlert({ show: false, type: "", message: "" });
  };

  const handleExerciseToggle = (exercise) => {
    setSportExercises((prev) => {
      const newSelection = prev.includes(exercise)
        ? prev.filter((item) => item !== exercise)
        : [...prev, exercise];

      updateField("sportExercises", newSelection);
      return newSelection;
    });
  };

  const handleAddCustomExercise = () => {
    if (!customExercise.trim()) {
      showAlert("warning", "Please enter a valid exercise name.");
      return;
    }

    if (sportExercises.includes(customExercise.trim())) {
      showAlert("warning", "This exercise is already selected.");
      return;
    }

    const newExercise = customExercise.trim();
    const updatedExercises = [...sportExercises, newExercise];
    setSportExercises(updatedExercises);
    updateField("sportExercises", updatedExercises);
    setCustomExercise("");
    hideAlert();
  };

  const handleRemoveExercise = (exercise) => {
    const updatedExercises = sportExercises.filter((item) => item !== exercise);
    setSportExercises(updatedExercises);
    updateField("sportExercises", updatedExercises);
  };

  const handleContinue = () => {
    const finalExercises = [...sportExercises];
    
    // Add "Other" exercise if specified
    if (customExercise.trim()) {
      finalExercises.push(customExercise.trim());
    }

    if (finalExercises.length === 0) {
      showAlert(
        "warning",
        "Please select at least one sport or exercise you're interested in."
      );
      return;
    }

    // Update the onboarding context
    updateField("sportExercises", finalExercises);
    
    // Update step and navigate to next step
    updateStep(14);
    router.push("/goal-reach");
  };

  return (
    <>
      <section className="auth-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
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
                <p className="text-uppercase mb-2">Sports & Exercises</p>
                <h3 className="mb-4">
                Do you want to add some sports exercises?{" "}
                </h3>
                <div className="food-card">
                  {exerciseOptions.map((exercise) => (
                    <div key={exercise} className="food-bx">
                      <input
                        type="checkbox"
                        id={`exercise-${exercise}`}
                        className="d-none"
                        checked={sportExercises.includes(exercise)}
                        onChange={() => handleExerciseToggle(exercise)}
                      />
                      <label htmlFor={`exercise-${exercise}`}>
                        {exercise}
                      </label>
                    </div>
                  ))}
                  
                  {/* Other option similar to health-conditions */}
                  <div className="food-bx">
                    <input
                      type="checkbox"
                      id="other-exercise"
                      className="d-none"
                      checked={customExercise.trim() !== ""}
                      onChange={() => {
                        if (customExercise.trim() === "") {
                          // Focus the text input when checking "Other"
                          setTimeout(() => {
                            const otherInput = document.querySelector('input[placeholder="If other (please specify)"]');
                            if (otherInput) otherInput.focus();
                          }, 100);
                        } else {
                          setCustomExercise("");
                        }
                      }}
                    />
                    {/* <label htmlFor="other-exercise">
                      Other
                    </label> */}
                  </div>
                </div>
                
                <div className="custom-frm-bx mt-4 px-135">
                  <input
                    className="form-control"
                    placeholder="If other (please specify)"
                    type="text"
                    value={customExercise}
                    onChange={(e) => setCustomExercise(e.target.value)}
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

export default function SportsExercisesPage() {
  return (
    <Suspense fallback={<div></div>}>
      <SportsExercisesContent />
    </Suspense>
  );
}