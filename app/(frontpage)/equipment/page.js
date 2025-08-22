'use client';

import Link from "next/link";
import { useState, useEffect , Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useOnboarding } from "../../../context/OnboardingContext";
import { apiService } from "../../../lib/api";
import Alert from "../../../Components/Alert";

function EquipmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state, updateField, updateStep, isStepValid } = useOnboarding();
  const [workoutLocation, setWorkoutLocation] = useState(state.workoutLocation || '');
  const [equipments, setEquipments] = useState([]);
  const [selectedEquipments, setSelectedEquipments] = useState(state.selectedEquipments || []);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  useEffect(() => {
    if (state.isAuthChecked && state.isAuthenticated === false) {
      router.push('/register');
    }
  }, [state.isAuthenticated, router]);

  useEffect(() => {
    updateStep(10);

    // Check for location parameter in URL
    const locationParam = searchParams.get('location');
    if (locationParam) {
      const validLocations = ['home', 'gym', 'outdoors'];
      const normalizedLocation = locationParam.toLowerCase();
      
      if (validLocations.includes(normalizedLocation)) {
        setWorkoutLocation(normalizedLocation);
        updateField('workoutLocation', normalizedLocation);
        fetchEquipments(normalizedLocation);
        return;
      }
    }

    // If no valid URL parameter, use existing location from state
    if (workoutLocation) {
      fetchEquipments(workoutLocation);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run only once


  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
  };

  const hideAlert = () => {
    setAlert({ show: false, type: '', message: '' });
  };

  const fetchEquipments = async (location) => {
    setLoading(true);
    hideAlert();

    try {
      let apiLocation = location.toLowerCase();
      if (apiLocation === 'outdoors') {
        apiLocation = 'outdoors';
      }

      const response = await apiService.getEquipments(apiLocation);

      if (response.success) {
        setEquipments(response.result || []);
      } else {
        showAlert('error', 'Failed to load equipment options. Please try again.');
      }
    } catch (error) {
      console.error('Equipment fetch error:', error);
      showAlert('error', 'Failed to load equipment options. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationChange = (location) => {
    setWorkoutLocation(location);
    updateField('workoutLocation', location);
    setSelectedEquipments([]); // Reset equipment selection
    updateField('selectedEquipments', []);
    fetchEquipments(location);
  };

  const handleEquipmentToggle = (equipmentId) => {
    setSelectedEquipments(prev => {
      const newSelection = prev.includes(equipmentId)
        ? prev.filter(id => id !== equipmentId)
        : [...prev, equipmentId];

      updateField('selectedEquipments', newSelection);
      return newSelection;
    });
  };

  const handleContinue = (e) => {
    e.preventDefault();

    if (!workoutLocation) {
      showAlert('warning', 'Please select your workout location.');
      return;
    }

    if (selectedEquipments.length === 0) {
      showAlert('warning', 'Please select at least one piece of equipment you have access to.');
      return;
    }

    if (isStepValid(10)) {
      updateStep(11);
      router.push('/goal-reach');
    }
  };

  return (
    <>
     <Suspense fallback={<div></div>}>  
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

              <div className="auth-cards equipment ">
                <p className="text-uppercase mb-2">Equipments</p>
                <h3 className="mb-2">
                  What equipment do you <br /> have access to?
                </h3>
                <form onSubmit={handleContinue}>
                  <div className="gender-cards mb-4">
                    <div>
                      <input
                        type="radio"
                        id="home"
                        className="d-none"
                        name="location"
                        value="home"
                        checked={workoutLocation === 'home'}
                        onChange={() => handleLocationChange('home')}
                      />
                      <label htmlFor="home" className={workoutLocation === 'home' ? 'selected' : ''}>
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
                        checked={workoutLocation === 'gym'}
                        onChange={() => handleLocationChange('gym')}
                      />
                      <label htmlFor="gym" className={workoutLocation === 'gym' ? 'selected' : ''}>
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
                        checked={workoutLocation === 'outdoors'}
                        onChange={() => handleLocationChange('outdoors')}
                      />
                      <label htmlFor="outdoors" className={workoutLocation === 'outdoors' ? 'selected' : ''}>
                        <div className="gender-img">
                          <img src="/images/location-03.png" alt="Outdoors" />
                        </div>
                        Outdoors
                      </label>
                    </div>
                  </div>

                  {workoutLocation && (
                    <>
                      {loading ? (
                        <div className="text-center py-4">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading equipment...</span>
                          </div>
                          <p className="mt-2">Loading available equipment...</p>
                        </div>
                      ) : (
                        <div className="equipment-list mb-4">
                          {equipments.map((equipment) => (
                            <div key={equipment.id} className="equipment-bx">
                              <input
                                type="checkbox"
                                id={`equipment-${equipment.id}`}
                                name="equipment"
                                className="d-none"
                                checked={selectedEquipments.includes(equipment.id)}
                                onChange={() => handleEquipmentToggle(equipment.id)}
                              />
                              <label
                                htmlFor={`equipment-${equipment.id}`}
                                className={selectedEquipments.includes(equipment.id) ? 'selected' : ''}
                              >
                                <span style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'block' }}>
                                  {equipment.icon}
                                </span>
                                {equipment.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}

                      {equipments.length === 0 && !loading && (
                        <div className="text-center py-4">
                          <p>No equipment options available for your selected location.</p>
                        </div>
                      )}
                    </>
                  )}

                  <div className="text-center">
                    <button
                      type="submit"
                      className="custom-btn continue-btn"
                      disabled={!workoutLocation || selectedEquipments.length === 0 || loading}
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
       </Suspense>
    </>
  );
}

export default EquipmentPage;
