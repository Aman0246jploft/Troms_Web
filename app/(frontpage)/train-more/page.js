"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "../../../context/OnboardingContext";

function TrainMorePage() {
  const router = useRouter();
  const { state, updateField, updateStep, isStepValid } = useOnboarding();
  const [isMoreThanOnce, setIsMoreThanOnce] = useState(true);
  const [selectedDays, setSelectedDays] = useState([]);
  const [currentMonthDays, setCurrentMonthDays] = useState([]);

  useEffect(() => {
    if (!state.isAuthChecked) return; // wait for auth check

    if (state.isAuthenticated === false) {
      router.push("/register");
      return;
    }
    if (!state.gender) {
      router.push("/select-gender");
      return;
    }
    if (!state.dateOfBirth || state.age < 13) {
      router.push("/borndate");
      return;
    }
    if (!state.trainingDay) {
      router.push("/training-days");
      return;
    }

    // Only update step if it's not already set
    if (state.currentStep !== 5) {
      updateStep(5);
    }
  }, [
    state.isAuthChecked,
    state.isAuthenticated,
    state.gender,
    state.dateOfBirth,
    state.age,
    state.trainingDay,
    state.currentStep,
    router,
    updateStep,
  ]);

  useEffect(() => {
    // Generate current month days
    generateCurrentMonthDays();

    // Load saved state
    if (state.trainMoreThanOnce) {
      setIsMoreThanOnce(state.trainMoreThanOnce.isMoreThanOnce);
      setSelectedDays(state.trainMoreThanOnce.specificDays || []);
    }
  }, [state.trainMoreThanOnce, state.trainingDays]);

  // const generateCurrentMonthDays = () => {
  //   // Get the selected training days from the previous page
  //   const selectedTrainingDays = state.trainingDays || [];

  //   if (selectedTrainingDays.length === 0) {
  //     setCurrentMonthDays([]);
  //     return;
  //   }

  //   const now = new Date();

  //   // Find the start of the current week (Sunday)
  //   const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
  //   const startOfWeek = new Date(now);
  //   startOfWeek.setDate(now.getDate() - currentDay);

  //   // Day mapping for correct indexing
  //   const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  //   const dayMapping = {
  //     "SUN": 0, "MON": 1, "TUE": 2, "WED": 3,
  //     "THU": 4, "FRI": 5, "SAT": 6
  //   };
  //   const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  //                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  //   const days = [];

  //   // Only generate days that were selected in training-days page
  //   selectedTrainingDays.forEach(selectedDay => {
  //     const dayIndex = dayMapping[selectedDay];
  //     if (dayIndex !== undefined) {
  //       const date = new Date(startOfWeek);
  //       date.setDate(startOfWeek.getDate() + dayIndex);

  //       const dayName = dayNames[dayIndex];
  //       const dayValue = selectedDay; // Use the selected day value (MON, TUE, etc.)

  //       days.push({
  //         date: date.getDate(),
  //         month: monthNames[date.getMonth()],
  //         dayName: dayName,
  //         dayValue: dayValue,
  //         id: dayValue.toLowerCase()
  //       });
  //     }
  //   });

  //   // Sort days by their original week order
  //   days.sort((a, b) => dayMapping[a.dayValue] - dayMapping[b.dayValue]);

  //   console.log("Generated days based on selected training days:", days); // Debug log
  //   console.log("Selected training days:", selectedTrainingDays); // Debug log
  //   setCurrentMonthDays(days);
  // };

  const generateCurrentMonthDays = () => {
    const selectedTrainingDays = state.trainingDays || [];

    if (selectedTrainingDays.length === 0) {
      setCurrentMonthDays([]);
      return;
    }

    const dayMapping = {
      SUN: 0,
      MON: 1,
      TUE: 2,
      WED: 3,
      THU: 4,
      FRI: 5,
      SAT: 6,
    };

    const days = [];

    selectedTrainingDays
      .sort((a, b) => dayMapping[a] - dayMapping[b])
      .forEach((selectedDay, index) => {
        days.push({
          dayValue: selectedDay,
          month: `Day`, // 👈 Always "Day"
          date: `${index + 1}`, // 👈 Numbered Day 1, Day 2...
          dayName: selectedDay, // Keep same as before
          id: selectedDay.toLowerCase(),
        });
      });

    console.log("Generated numbered days:", days);
    setCurrentMonthDays(days);
  };

  const handleTrainMoreChange = (value) => {
    setIsMoreThanOnce(value);

    // If "No" is selected, clear specific days
    const newSelectedDays = value ? selectedDays : [];
    if (!value) {
      setSelectedDays([]);
    }

    // Immediately update the context and localStorage
    updateField("trainMoreThanOnce", {
      isMoreThanOnce: value,
      specificDays: newSelectedDays,
    });
  };

  const handleDayToggle = (dayValue) => {
    console.log("Day toggle clicked:", dayValue); // Debug log
    setSelectedDays((prev) => {
      console.log("Previous selected days:", prev); // Debug log
      const newSelectedDays = prev.includes(dayValue)
        ? prev.filter((day) => day !== dayValue)
        : [...prev, dayValue];

      console.log("New selected days:", newSelectedDays); // Debug log

      // Immediately update the context and localStorage
      updateField("trainMoreThanOnce", {
        isMoreThanOnce,
        specificDays: newSelectedDays,
      });

      return newSelectedDays;
    });
  };

  const handleContinue = () => {
    // Validate: if isMoreThanOnce is true, specificDays should not be empty
    if (isMoreThanOnce && selectedDays.length === 0) {
      alert(
        "Please select at least one specific day when training more than once a day."
      );
      return;
    }

    // Update the onboarding context
    updateField("trainMoreThanOnce", {
      isMoreThanOnce,
      specificDays: isMoreThanOnce ? selectedDays : [],
    });

    if (isStepValid(5)) {
      updateStep(6);
      router.push("/feedback");
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
              <div className="auth-cards goal">
                <button type="button" className="new_back_btn">
                  Previous
                </button>
                <p className="text-uppercase mb-2">train more than</p>
                <h3 className="mb-4">Do you train more than once a day? </h3>
                <form>
                  <div className="px-135">
                    <div className="custom-check">
                      <input
                        type="radio"
                        id="yes"
                        className="d-none"
                        name="gym"
                        checked={isMoreThanOnce === true}
                        onChange={() => handleTrainMoreChange(true)}
                      />
                      <label htmlFor="yes">Yes</label>
                    </div>
                    <div className="custom-check">
                      <input
                        type="radio"
                        id="no"
                        className="d-none"
                        name="gym"
                        checked={isMoreThanOnce === false}
                        onChange={() => handleTrainMoreChange(false)}
                      />
                      <label htmlFor="no">No</label>
                    </div>
                  </div>
                  {isMoreThanOnce && (
                    <>
                      <h5 className="text-center mt-3">
                        Selection of specific days
                      </h5>
                      <ul className="days-list">
                        {currentMonthDays.map((day) => {
                          const isSelected = selectedDays.includes(
                            day.dayValue
                          );
                          console.log(
                            `Day ${day.dayValue} - Selected: ${isSelected}, Selected Days:`,
                            selectedDays
                          ); // Debug log
                          return (
                            <li
                              key={day.id}
                              className={`days-list-item ${
                                isSelected ? "active" : ""
                              }`}
                            >
                              <input
                                type="checkbox"
                                name="select-days"
                                id={day.id}
                                className="d-none"
                                checked={isSelected}
                                onChange={() => handleDayToggle(day.dayValue)}
                              />
                              <label htmlFor={day.id}>
                                <span>
                                  {day.month} {day.date}{" "}
                                </span>
                                {day.dayName}
                              </label>
                            </li>
                          );
                        })}
                      </ul>
                    </>
                  )}
                </form>
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

export default TrainMorePage;
