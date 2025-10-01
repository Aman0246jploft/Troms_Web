"use client";
import CountryPicker from "../../../Components/CountryPicker";
import CityPicker from "../../../Components/CityPicker";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "../../../context/OnboardingContext";
import Alert from "../../../Components/Alert";

function ChooseCountryPage() {
  const router = useRouter();
  const { state, updateField, updateStep } = useOnboarding();
  const [selectedCountry, setSelectedCountry] = useState(state.selectedCountry);
  const [selectedCity, setSelectedCity] = useState(state.selectedCity || "");
  const [cities, setCities] = useState([]);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [activeDropdown, setActiveDropdown] = useState(null); // 'country' or 'city' or null

  // Set the step for country selection (adding as step 2 after registration)
  useEffect(() => {
    if (state.currentStep !== 21) {
      updateStep(22);
    }
  }, []);

  // Initialize cities if country is already selected
  useEffect(() => {
    if (selectedCountry && selectedCountry.cities) {
      setCities(selectedCountry.cities);
    }
  }, [selectedCountry]);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
  };

  const hideAlert = () => {
    setAlert({ show: false, type: "", message: "" });
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    updateField("selectedCountry", country);

    // Reset city selection when country changes
    setSelectedCity("");
    updateField("selectedCity", "");

    // Update cities list
    setCities(country.cities || []);
    hideAlert();
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    updateField("selectedCity", city);
    hideAlert();
  };

  const handleContinue = (e) => {
    e.preventDefault();

    if (!selectedCountry) {
      showAlert("warning", "Please select a country to continue.");
      return;
    }
    if (!selectedCity) {
      showAlert("warning", "Please select a city to continue.");
      return;
    }

    // Navigate to the next step - you can change this to the appropriate next page
    router.push("/budget");
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
              <div className="auth-cards health-conditions">
                <button type="button" className="new_back_btn">
                  Previous
                </button>
                <p className="text-uppercase mb-2">Choose a country</p>
                <h3 className="mb-4">
                  Choose a country and city to see foods that match your
                  location.
                </h3>
                <div className="px-135">
                  <form onSubmit={handleContinue}>
                    <div className="custom-frm-bx">
                      <CountryPicker
                        onCountrySelect={handleCountrySelect}
                        selectedCountry={selectedCountry}
                        isOpen={activeDropdown === "country"}
                        onToggle={setActiveDropdown}
                      />
                    </div>
                    <div className="custom-frm-bx">
                      <CityPicker
                        cities={cities}
                        onCitySelect={handleCitySelect}
                        selectedCity={selectedCity}
                        disabled={!selectedCountry || cities.length === 0}
                        isOpen={activeDropdown === "city"}
                        onToggle={setActiveDropdown}
                      />
                    </div>

                    {alert.show && (
                      <Alert
                        type={alert.type}
                        message={alert.message}
                        onClose={hideAlert}
                      />
                    )}

                    <div className="text-center mt-3">
                      <button
                        type="submit"
                        className="custom-btn continue-btn"
                        disabled={!selectedCountry || !selectedCity}
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
    </>
  );
}

export default ChooseCountryPage;
