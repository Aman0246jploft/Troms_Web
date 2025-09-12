"use client";
import CountryPicker from "../../../Components/CountryPicker";
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

  // Set the step for country selection (adding as step 2 after registration)
  useEffect(() => {
                                                                                      // Only update step if it's not already set to 2
    if (state.currentStep !== 20) {
      updateStep(20);
    }
  }, [state.currentStep, updateStep]);    

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

  const handleCitySelect = (e) => {
    const city = e.target.value;
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
                      />
                    </div>
                    <div className="custom-frm-bx">
                      <select 
                        className="form-select" 
                        value={selectedCity}
                        onChange={handleCitySelect}
                        disabled={!selectedCountry || cities.length === 0}
                      >
                        <option value="">
                          {!selectedCountry 
                            ? "Select a country first" 
                            : cities.length === 0 
                            ? "No cities available" 
                            : "Select City"
                          }
                        </option>
                        {cities.map((city, index) => (
                          <option key={index} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
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
      </section>
    </>
  );
}

export default ChooseCountryPage;