"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "../../../context/OnboardingContext";

function TrainMorePage() {
  const router = useRouter();
  const { state, updateField } = useOnboarding();
  const [isMoreThanOnce, setIsMoreThanOnce] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);
  const [currentMonthDays, setCurrentMonthDays] = useState([]);

  useEffect(() => {
    // Generate current month days
    generateCurrentMonthDays();
    
    // Load saved state
    if (state.trainMoreThanOnce) {
      setIsMoreThanOnce(state.trainMoreThanOnce.isMoreThanOnce);
      setSelectedDays(state.trainMoreThanOnce.specificDays || []);
    }
  }, [state.trainMoreThanOnce]);

  const generateCurrentMonthDays = () => {
    const now = new Date();
    
    // Find the start of the current week (Sunday)
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - currentDay);
    
    // Generate 7 days starting from Sunday
    const days = [];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                       "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      
      const dayName = dayNames[i]; // i corresponds to day index (0=Sun, 1=Mon, etc.)
      const dayValue = dayName.toUpperCase(); // SUN, MON, TUE, etc.
      
      days.push({
        date: date.getDate(),
        month: monthNames[date.getMonth()],
        dayName: dayName,
        dayValue: dayValue,
        id: dayValue.toLowerCase()
      });
    }
    
    console.log("Generated days:", days); // Debug log
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
      specificDays: newSelectedDays
    });
  };

  const handleDayToggle = (dayValue) => {
    console.log("Day toggle clicked:", dayValue); // Debug log
    setSelectedDays(prev => {
      console.log("Previous selected days:", prev); // Debug log
      const newSelectedDays = prev.includes(dayValue) 
        ? prev.filter(day => day !== dayValue)
        : [...prev, dayValue];
      
      console.log("New selected days:", newSelectedDays); // Debug log
      
      // Immediately update the context and localStorage
      updateField("trainMoreThanOnce", {
        isMoreThanOnce,
        specificDays: newSelectedDays
      });
      
      return newSelectedDays;
    });
  };

  const handleContinue = () => {
    // Validate: if isMoreThanOnce is true, specificDays should not be empty
    if (isMoreThanOnce && selectedDays.length === 0) {
      alert("Please select at least one specific day when training more than once a day.");
      return;
    }

    // Update the onboarding context
    updateField("trainMoreThanOnce", {
      isMoreThanOnce,
      specificDays: isMoreThanOnce ? selectedDays : []
    });
    
    // Navigate to next step - assuming this comes after health-conditions
    router.push("/choose-country");
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
                          const isSelected = selectedDays.includes(day.dayValue);
                          console.log(`Day ${day.dayValue} - Selected: ${isSelected}, Selected Days:`, selectedDays); // Debug log
                          return (
                          <li key={day.id} className={`days-list-item ${isSelected ? "active" : ""}`}>
                            <input
                              type="checkbox"
                              name="select-days"
                              id={day.id}
                              className="d-none"
                              checked={isSelected}
                              onChange={() => handleDayToggle(day.dayValue)}
                            />
                            <label htmlFor={day.id}>
                              <span>{day.month} {day.date} </span>
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
      </section>
    </>
  );
}

export default TrainMorePage;
