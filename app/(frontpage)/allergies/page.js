'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "../../../context/OnboardingContext";
import { apiService } from "../../../lib/api";
import Alert from "../../../Components/Alert";

function AllergiesPage() {
  const router = useRouter();
  const { state, updateField, updateStep, isStepValid } = useOnboarding();
  const [allergicFoods, setAllergicFoods] = useState([]);
  const [selectedAllergies, setSelectedAllergies] = useState(state.allergicFoodItems || []);
  const [customAllergy, setCustomAllergy] = useState('');
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  useEffect(() => {
    if (!state.isAuthChecked) return; // wait for auth check

    if (state.isAuthenticated === false) {
      router.push('/register');
      return;
    }
    if (!state.accomplish || state.accomplish.length === 0) {
      router.push('/accomplish');
      return;
    }

    // Only update step if it's not already set
    if (state.currentStep !== 19) {
      updateStep(19);
    }
  }, [state.isAuthChecked, state.isAuthenticated, state.accomplish, state.currentStep, router, updateStep]);

  useEffect(() => {
    fetchAllergicFoodItems();
  }, []);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
  };

  const hideAlert = () => {
    setAlert({ show: false, type: '', message: '' });
  };

  const fetchAllergicFoodItems = async () => {
    setLoading(true);
    hideAlert();

    try {
      const response = await apiService.getAllergicFoodItems();
      
      if (response.success) {
        const apiAllergies = response.result || [];
        
        // Add custom allergies that were previously selected but not in API
        const customAllergies = selectedAllergies
          .filter(selectedAllergy => !apiAllergies.some(food => food.ingredients_name === selectedAllergy))
          .map(customAllergy => ({
            id: `custom-${customAllergy.replace(/\s+/g, '-').toLowerCase()}`,
            ingredients_name: customAllergy
          }));
        
        setAllergicFoods([...apiAllergies, ...customAllergies]);
      } else {
        showAlert('error', 'Failed to load allergic food items. Please try again.');
      }
    } catch (error) {
      console.error('Allergic food items fetch error:', error);
      showAlert('error', 'Failed to load allergic food items. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleAllergyToggle = (allergyName) => {
    setSelectedAllergies(prev => {
      const newSelection = prev.includes(allergyName)
        ? prev.filter(name => name !== allergyName)
        : [...prev, allergyName];
      
      updateField('allergicFoodItems', newSelection);
      return newSelection;
    });
    hideAlert();
  };

  const handleCustomAllergyAdd = () => {
    if (customAllergy.trim()) {
      const newAllergy = customAllergy.trim();
      if (!selectedAllergies.includes(newAllergy) && !allergicFoods.some(food => food.ingredients_name === newAllergy)) {
        // Add to the allergic foods list for immediate display
        const customAllergyObj = {
          id: `custom-${Date.now()}`,
          ingredients_name: newAllergy
        };
        setAllergicFoods(prev => [...prev, customAllergyObj]);
        
        // Also add to selected allergies
        const newSelection = [...selectedAllergies, newAllergy];
        setSelectedAllergies(newSelection);
        updateField('allergicFoodItems', newSelection);
        setCustomAllergy('');
        hideAlert();
      } else {
        showAlert('warning', 'This allergy is already in the list or selected.');
      }
    }
  };

  const handleRemoveAllergy = (allergyName) => {
    const newSelection = selectedAllergies.filter(name => name !== allergyName);
    setSelectedAllergies(newSelection);
    updateField('allergicFoodItems', newSelection);
  };

  const handleContinue = (e) => {
    e.preventDefault();
    
    // Allergies are optional, so we can continue even with no selections
    if (isStepValid(19)) {
      updateStep(20);
      router.push('/dislikes');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCustomAllergyAdd();
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
    
                <h3 className="mb-4">
                  Do you have any food allergies <br /> we should be aware of?
                </h3>
                
                {loading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading allergic food items...</span>
                    </div>
                    <p className="mt-2">Loading available allergic food items...</p>
                  </div>
                ) : (
                  <>
                    <div className="food-card px-135">
                      {allergicFoods.map((food) => (
                        <div key={food.id} className="food-bx">
                          <input 
                            type="checkbox" 
                            className="d-none" 
                            id={`allergy-${food.id}`}
                            checked={selectedAllergies.includes(food.ingredients_name)}
                            onChange={() => handleAllergyToggle(food.ingredients_name)}
                          />
                          <label 
                            htmlFor={`allergy-${food.id}`}
                            className={selectedAllergies.includes(food.ingredients_name) ? 'selected' : ''}
                          >
                            {food.ingredients_name}
                            {selectedAllergies.includes(food.ingredients_name) && (
                              <button 
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleRemoveAllergy(food.ingredients_name);
                                }}
                              >
                                <img src="/images/close.svg" alt="Remove" />
                              </button>
                            )}
                          </label>
                        </div>
                      ))}
                    </div>
                    
                    <div className="custom-frm-bx mt-4 px-135">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="If other (please specify)"
                        value={customAllergy}
                        onChange={(e) => setCustomAllergy(e.target.value)}
                        onKeyPress={handleKeyPress}
                      />
                    </div>
                    
              
                    
                    {allergicFoods.length === 0 && !loading && (
                      <div className="text-center py-4">
                        <p>No allergic food items available at the moment.</p>
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

export default AllergiesPage;
