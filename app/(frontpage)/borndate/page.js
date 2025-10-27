"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "../../../context/OnboardingContext";
import Alert from "../../../Components/Alert";
import WheelPicker from "../../../Components/WheelPicker";

function BornDatePage() {
  const router = useRouter();
  const { state, calculateAge, updateStep, isStepValid } = useOnboarding();
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedYear, setSelectedYear] = useState(0);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Generate years (from current year - 100 to current year - 13)
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear - 13; year >= currentYear - 100; year--) {
      years.push(year);
    }
    return years;
  };

  useEffect(() => {
    if (state.isAuthChecked && state.isAuthenticated === false) {
      router.push("/register");
    } else if (!state.gender) {
      router.push("/select-gender");
    }
  }, [state.isAuthenticated, state.gender, router]);

  useEffect(() => {
    updateStep(3);

    if (state.dateOfBirth) {
      const date = new Date(state.dateOfBirth);
      setSelectedMonth(date.getMonth());
      setSelectedDay(date.getDate() - 1); // WheelPicker uses 0-based index
      const years = generateYears();
      const yearIndex = years.indexOf(date.getFullYear());
      setSelectedYear(yearIndex >= 0 ? yearIndex : 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // empty array = run once on mount

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
  };

  const hideAlert = () => {
    setAlert({ show: false, type: "", message: "" });
  };

  const handleDateChange = () => {
    if (
      selectedMonth !== undefined &&
      selectedDay !== undefined &&
      selectedYear !== undefined
    ) {
      const years = generateYears();
      const year = years[selectedYear];
      const monthIndex = selectedMonth;
      const day = selectedDay + 1; // Convert back from 0-based index

      const dateString = `${year}-${String(monthIndex + 1).padStart(
        2,
        "0"
      )}-${String(day).padStart(2, "0")}`;

      // Validate date
      const selectedDate = new Date(dateString);
      const today = new Date();

      if (selectedDate > today) {
        showAlert("warning", "Birth date cannot be in the future.");
        return;
      }

      // Calculate age
      let age = today.getFullYear() - selectedDate.getFullYear();
      const monthDiff = today.getMonth() - selectedDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < selectedDate.getDate())
      ) {
        age--;
      }

      // if (age < 13) {
      //   showAlert(
      //     "warning",
      //     "You must be at least 13 years old to use this app."
      //   );
      //   return;
      // }

      // if (age > 100) {
      //   showAlert("warning", "Please enter a valid birth date.");
      //   return;
      // }

      calculateAge(dateString);
      hideAlert();
    }
  };

  useEffect(() => {
    handleDateChange();
  }, [selectedMonth, selectedDay, selectedYear]);

  const handleContinue = (e) => {
    e.preventDefault();

    if (
      selectedMonth === undefined ||
      selectedDay === undefined ||
      selectedYear === undefined
    ) {
      showAlert(
        "warning",
        "Please select your complete birth date to continue."
      );
      return;
    }

    if (state.age < 13) {
      showAlert("error", "You must be at least 13 years old to use this app.");
      return;
    }

    if (isStepValid(3)) {
      updateStep(4);
      router.push("/training-days");
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

              <div className="auth-cards borndate">
                <button 
                  onClick={() => router.back()}
                type="button" className="new_back_btn">
                  Previous
                </button>
                <p className="text-uppercase mb-3">Your born date</p>
                <h3 className="mb-2">What's your birthday?</h3>
                <p>This will be used to calibrate your custom plan.</p>

                <WheelPicker
                  initialMonth={selectedMonth}
                  initialDay={selectedDay}
                  initialYear={selectedYear}
                  onMonthChange={setSelectedMonth}
                  onDayChange={setSelectedDay}
                  onYearChange={setSelectedYear}
                />

                {/* {state.age > 0 && ( */}
                {/* <div className="text-center mt-2"> */}
                {/* <h6 className="clr fw-600">Age: {state.age} years old</h6> */}
                {/* </div> */}
                {/* )} */}

                <div className="text-center mt-4">
                  <button
                    type="submit"
                    className="custom-btn continue-btn"
                    onClick={handleContinue}
                    disabled={
                      selectedMonth === undefined ||
                      selectedDay === undefined ||
                      selectedYear === undefined ||
                      state.age < 13
                    }
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

export default BornDatePage;