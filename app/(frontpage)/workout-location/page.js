'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "../../../context/OnboardingContext";
import Alert from "../../../Components/Alert";

function WorkoutLocationPage() {
  const router = useRouter();
  const { state, updateField, updateStep, isStepValid } = useOnboarding();
  const [selectedLocation, setSelectedLocation] = useState(state.workoutLocation || '');
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  useEffect(() => {
    if (state.isAuthChecked && state.isAuthenticated === false) {
      router.push('/register');
      return;
    }
    if (!state.desiredWeight || state.desiredWeight <= 0) {
      router.push('/desired-weight');
      return;
    }

    if (state.currentStep !== 9) {
      updateStep(9);
    }
  }, [state.isAuthChecked, state.isAuthenticated, state.desiredWeight, state.currentStep, router, updateStep]);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
  };

  const hideAlert = () => {
    setAlert({ show: false, type: '', message: '' });
  };

  const handleLocationChange = (location) => {
    setSelectedLocation(location);
    updateField('workoutLocation', location);
    hideAlert();
  };

  const handleContinue = (e) => {
    e.preventDefault();

    if (!selectedLocation) {
      showAlert('warning', 'Please select your workout location to continue.');
      return;
    }

    if (isStepValid(9)) {
      updateStep(10);
      // Navigate to equipment with the selected location as a URL parameter
      router.push(`/equipment?location=${selectedLocation.toLowerCase()}`);
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

              <div className="auth-cards gender location">
                <p className="text-uppercase mb-3">Workout Location</p>
                <h3 className="mb-3">Choose your workout location</h3>
                <form onSubmit={handleContinue}>
                  <div className="gender-cards ">
                    <div>
                      <input
                        type="radio"
                        id="home"
                        className="d-none"
                        name="location"
                        value="home"
                        checked={selectedLocation === 'home'}
                        onChange={() => handleLocationChange('home')}
                      />
                      <label htmlFor="home" className={selectedLocation === 'home' ? 'selected' : ''}>
                        <div className="gender-img">
                          <img src="/images/location-01.png" alt="Home" />
                        </div>
                        Home
                      </label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        id="gym"
                        className="d-none"
                        name="location"
                        value="gym"
                        checked={selectedLocation === 'gym'}
                        onChange={() => handleLocationChange('gym')}
                      />
                      <label htmlFor="gym" className={selectedLocation === 'gym' ? 'selected' : ''}>
                        <div className="gender-img">
                          <img src="/images/location-02.png" alt="Gym" />
                        </div>
                        Gym
                      </label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        id="outdoors"
                        className="d-none"
                        name="location"
                        value="outdoors"
                        checked={selectedLocation === 'outdoors'}
                        onChange={() => handleLocationChange('outdoors')}
                      />
                      <label htmlFor="outdoors" className={selectedLocation === 'outdoors' ? 'selected' : ''}>
                        <div className="gender-img">
                          <img src="/images/location-03.png" alt="Outdoors" />
                        </div>
                        Outdoors
                      </label>
                    </div>
                  </div>
                  <div className="text-center">
                    <button
                      type="submit"
                      className="custom-btn continue-btn"
                      disabled={!selectedLocation}
                    >
                      Continue
                    </button>
                  </div>
                </form>
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

export default WorkoutLocationPage;
