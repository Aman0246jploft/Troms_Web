'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "../../../context/OnboardingContext";
import { apiService } from "../../../lib/api";
import Alert from "../../../Components/Alert";

function InjuriesPage() {
  const router = useRouter();
  const { state, updateField, updateStep, isStepValid } = useOnboarding();
  const [injuryList, setInjuryList] = useState([]);
  const [selectedInjuries, setSelectedInjuries] = useState(state.injuries || []);
  const [customInjury, setCustomInjury] = useState('');
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  useEffect(() => {
    if (!state.isAuthChecked) return; // wait for auth check

    if (state.isAuthenticated === false) {
      router.push('/register');
      return;
    }
    // Note: dislikedFoodItems can be empty array, so we check if it exists
    if (state.dislikedFoodItems === undefined) {
      router.push('/dislikes');
      return;
    }

    // Only update step if it's not already set
    
    if (state.currentStep !== 21) {
      updateStep(21);
    }
  }, [state.isAuthChecked, state.isAuthenticated, state.dislikedFoodItems, state.currentStep, router, updateStep]);

  useEffect(() => {
    fetchInjuries();
  }, []);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
  };

  const hideAlert = () => {
    setAlert({ show: false, type: '', message: '' });
  };

  const fetchInjuries = async () => {
    setLoading(true);
    hideAlert();

    try {
      const response = await apiService.getInjuries();
      
      if (response.success) {
        const apiInjuries = response.result || [];
        
        // Add custom injuries that were previously selected but not in API
        const customInjuries = selectedInjuries
          .filter(selectedInjury => !apiInjuries.some(injury => injury.injury_name === selectedInjury))
          .map(customInjury => ({
            id: `custom-${customInjury.replace(/\s+/g, '-').toLowerCase()}`,
            injury_name: customInjury
          }));
        
        setInjuryList([...apiInjuries, ...customInjuries]);
      } else {
        showAlert('error', 'Failed to load injuries. Please try again.');
      }
    } catch (error) {
      console.error('Injuries fetch error:', error);
      showAlert('error', 'Failed to load injuries. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleInjuryToggle = (injuryName) => {
    setSelectedInjuries(prev => {
      const newSelection = prev.includes(injuryName)
        ? prev.filter(name => name !== injuryName)
        : [...prev, injuryName];
      
      updateField('injuries', newSelection);
      return newSelection;
    });
    hideAlert();
  };

  const handleCustomInjuryAdd = () => {
    if (customInjury.trim()) {
      const newInjury = customInjury.trim();
      if (!selectedInjuries.includes(newInjury) && !injuryList.some(injury => injury.injury_name === newInjury)) {
        // Add to the injury list for immediate display
        const customInjuryObj = {
          id: `custom-${Date.now()}`,
          injury_name: newInjury
        };
        setInjuryList(prev => [...prev, customInjuryObj]);
        
        // Also add to selected injuries
        const newSelection = [...selectedInjuries, newInjury];
        setSelectedInjuries(newSelection);
        updateField('injuries', newSelection);
        setCustomInjury('');
        hideAlert();
      } else {
        showAlert('warning', 'This injury is already in the list or selected.');
      }
    }
  };

  const handleRemoveInjury = (injuryName) => {
    const newSelection = selectedInjuries.filter(name => name !== injuryName);
    setSelectedInjuries(newSelection);
    updateField('injuries', newSelection);
  };

  const handleContinue = (e) => {
    e.preventDefault();
     if (selectedInjuries.length === 0) {

    return;
  }
    // Injuries are optional, so we can continue even with no selections
    if (isStepValid(21)) {
      updateStep(22);
      router.push('/crash-goal');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCustomInjuryAdd();
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
                <p className="text-uppercase mb-5">Injuries</p>
                <h3 className="mb-4">
                  Do you have any injuries <br /> we should be aware of?
                </h3>
                
                {loading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading injuries...</span>
                    </div>
                    <p className="mt-2">Loading available injuries...</p>
                  </div>
                ) : (
                  <>
                    <div className="food-card px-135">
                      {injuryList.map((injury) => (
                        <div key={injury.id} className="food-bx">
                          <input 
                            type="checkbox" 
                            className="d-none" 
                            id={`injury-${injury.id}`}
                            checked={selectedInjuries.includes(injury.injury_name)}
                            onChange={() => handleInjuryToggle(injury.injury_name)}
                          />
                          <label 
                            htmlFor={`injury-${injury.id}`}
                            className={selectedInjuries.includes(injury.injury_name) ? 'selected' : ''}
                          >
                            {injury.injury_name}
                            {selectedInjuries.includes(injury.injury_name) && (
                              <button 
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleRemoveInjury(injury.injury_name);
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
                        value={customInjury}
                        onChange={(e) => setCustomInjury(e.target.value)}
                        onKeyPress={handleKeyPress}
                      />
                    </div>
                    
                    {injuryList.length === 0 && !loading && (
                      <div className="text-center py-4">
                        <p>No injuries available at the moment.</p>
                      </div>
                    )}
                  </>
                )}
                
                <div className="text-center mt-3">
                  <button
                    onClick={handleContinue}
                    className="custom-btn continue-btn"
                   disabled={loading || selectedInjuries.length === 0}
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

export default InjuriesPage;
