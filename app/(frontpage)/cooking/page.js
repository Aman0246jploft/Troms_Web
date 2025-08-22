'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "../../../context/OnboardingContext";
import Alert from "../../../Components/Alert";

function CookingPage() {
  const router = useRouter();
  const { state, updateField, updateStep, isStepValid } = useOnboarding();
  const [selectedLevel, setSelectedLevel] = useState(state.cookingLevel || '');
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  useEffect(() => {
    if (!state.isAuthChecked) return; // wait for auth check

    if (state.isAuthenticated === false) {
      router.push('/register');
      return;
    }
    if (!state.cheatMealFoodItems || state.cheatMealFoodItems.length === 0) {
      router.push('/favorite-food');
      return;
    }

    // Only update step if it's not already set
    if (state.currentStep !== 17) {
      updateStep(17);
    }
  }, [state.isAuthChecked, state.isAuthenticated, state.cheatMealFoodItems, state.currentStep, router, updateStep]);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
  };

  const hideAlert = () => {
    setAlert({ show: false, type: '', message: '' });
  };

  const handleLevelChange = (level) => {
    setSelectedLevel(level);
    updateField('cookingLevel', level);
    hideAlert();
  };

  const handleContinue = (e) => {
    e.preventDefault();
    
    if (!selectedLevel) {
      showAlert('warning', 'Please select your cooking skill level to continue.');
      return;
    }

    if (isStepValid(17)) {
      updateStep(18);
      router.push('/accomplish');
    }
  };

  const getLevelDescription = (level) => {
    switch (level) {
      case 'Beginner':
        return 'Basic cooking skills - simple recipes and easy-to-follow instructions';
      case 'Intermediate':
        return 'Comfortable with various cooking techniques and moderate complexity recipes';
      case 'Advanced':
        return 'Skilled in complex cooking methods and can handle challenging recipes';
      default:
        return '';
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

              <div className="auth-cards weight-goal">
           
                <h3 className="mb-5">How good are you at cooking?</h3>
                <div className="px-135">
                  <form onSubmit={handleContinue}>
                    <div className="custom-check">
                      <input
                        type="radio"
                        id="Beginner"
                        name="cooking-skill"
                        className="d-none"
                        value="Beginner"
                        checked={selectedLevel === 'Beginner'}
                        onChange={() => handleLevelChange('Beginner')}
                      />
                      <label 
                        htmlFor="Beginner"
                        className={selectedLevel === 'Beginner' ? 'selected' : ''}
                      >
                        Beginner
                      </label>
                    </div>
                    <div className="custom-check">
                      <input
                        type="radio"
                        id="Intermediate"
                        name="cooking-skill"
                        className="d-none"
                        value="Intermediate"
                        checked={selectedLevel === 'Intermediate'}
                        onChange={() => handleLevelChange('Intermediate')}
                      />
                      <label 
                        htmlFor="Intermediate"
                        className={selectedLevel === 'Intermediate' ? 'selected' : ''}
                      >
                        Intermediate
                      </label>
                    </div>
                    <div className="custom-check">
                      <input
                        type="radio"
                        id="Advanced"
                        name="cooking-skill"
                        className="d-none"
                        value="Advanced"
                        checked={selectedLevel === 'Advanced'}
                        onChange={() => handleLevelChange('Advanced')}
                      />
                      <label 
                        htmlFor="Advanced"
                        className={selectedLevel === 'Advanced' ? 'selected' : ''}
                      >
                        Advanced
                      </label>
                    </div>
{/* 
                    {selectedLevel && (
                      <div className="mt-4 p-3 bg-light rounded">
                        <p className="mb-0 text-center">
                          <strong>{selectedLevel}:</strong> {getLevelDescription(selectedLevel)}
                        </p>
                      </div>
                    )} */}

                    <div className="text-center mt-5">
                      <button
                        type="submit"
                        className="custom-btn continue-btn"
                        disabled={!selectedLevel}
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

export default CookingPage;
