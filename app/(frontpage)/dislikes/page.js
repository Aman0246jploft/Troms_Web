"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "../../../context/OnboardingContext";
import { apiService } from "../../../lib/api";
import Alert from "../../../Components/Alert";

function DislikesPage() {
  const router = useRouter();
  const { state, updateField, updateStep, isStepValid } = useOnboarding();
  const [dislikedFoods, setDislikedFoods] = useState([]);
  // const [selectedDislikes, setSelectedDislikes] = useState(
  //   state.dislikedFoodItems || []
  // );

  const [selectedDislikes, setSelectedDislikes] = useState([]);

  const [customDislike, setCustomDislike] = useState("");
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });


  useEffect(() => {
    // Load previously selected dislikes from context/localStorage
    if (state.dislikedFoodItems && state.dislikedFoodItems.length > 0) {
      // Separate predefined dislikes from custom dislikes
      const predefinedDislikes = [];
      let customDislike = "";
      
      state.dislikedFoodItems.forEach(dislike => {
        // Check if this dislike matches any of the fetched disliked foods
        // If not, it's likely a custom dislike
        const isPredefined = dislikedFoods.some(food => food.ingredients_name === dislike);
        if (isPredefined || dislikedFoods.length === 0) {
          // Include if it's predefined or if we haven't loaded foods yet
          predefinedDislikes.push(dislike);
        }
        // Comment out the old custom dislike loading logic
        // else {
        //   // This is likely a custom dislike
        //   customDislike = dislike;
        // }
      });
      
      setSelectedDislikes(predefinedDislikes);
    }
    
    // Load custom dislike from the new field
    if (state.disliked_food_other_item) {
      setCustomDislike(state.disliked_food_other_item);
    }
  }, [state.dislikedFoodItems, state.disliked_food_other_item, dislikedFoods]);


  useEffect(() => {
    if (!state.isAuthChecked) return; // wait for auth check

    if (state.isAuthenticated === false) {
      router.push("/register");
      return;
    }
    // Note: allergicFoodItems can be empty array, so we check if it exists
    if (state.allergicFoodItems === undefined) {
      router.push("/allergies");
      return;
    }

    // Only update step if it's not already set
    if (state.currentStep !== 27) {
      updateStep(27);
    }
  }, [
    state.isAuthChecked,
    state.isAuthenticated,
    state.allergicFoodItems,
    state.currentStep,
    router,
    updateStep,
  ]);

  useEffect(() => {
    fetchDislikedFoodItems();
  }, []);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
  };

  const hideAlert = () => {
    setAlert({ show: false, type: "", message: "" });
  };

  const fetchDislikedFoodItems = async () => {
    setLoading(true);
    hideAlert();

    try {
      const response = await apiService.getDislikedFoodItems();

      if (response.success) {
        const apiDislikes = response.result || [];
        // Only set API dislikes, don't add custom ones to the list
        setDislikedFoods(apiDislikes);
      } else {
        showAlert(
          "error",
          "Failed to load disliked food items. Please try again."
        );
      }
    } catch (error) {
      console.error("Disliked food items fetch error:", error);
      showAlert(
        "error",
        "Failed to load disliked food items. Please check your internet connection."
      );
    } finally {
      setLoading(false);
    }
  };

const handleDislikeToggle = (dislikeName) => {
  setSelectedDislikes((prev) => {
    const newSelection = prev.includes(dislikeName)
      ? prev.filter((name) => name !== dislikeName)
      : [...prev, dislikeName];

    // update context after state change
    updateField("dislikedFoodItems", newSelection);
    return newSelection;
  });
};

  // Handle custom dislike input changes
  const handleCustomDislikeChange = (e) => {
    const value = e.target.value;
    setCustomDislike(value);
    // Store the input value in context immediately
    updateField("disliked_food_other_item", value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // Don't add to list automatically, just save the input value
      // User can manually select/add items if needed
    }
  };

  const handleRemoveDislike = (dislikeName) => {
    const newSelection = selectedDislikes.filter(
      (name) => name !== dislikeName
    );
    setSelectedDislikes(newSelection);
    updateField("dislikedFoodItems", newSelection);
  };

  const handleContinue = (e) => {
    e.preventDefault();

    // Update the onboarding context with selected dislikes and custom input separately
    updateField("dislikedFoodItems", selectedDislikes);
    updateField("disliked_food_other_item", customDislike.trim());
    
    // Dislikes are optional, so we can continue even with no selections
    updateStep(28);
    router.push("/injuries");
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
                <p className="text-uppercase mb-5">Dislikes</p>
                <h3 className="mb-4">
                  Are there any ingredients <br /> you'd prefer to avoid?
                </h3>

                {loading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">
                        Loading disliked food items...
                      </span>
                    </div>
                    <p className="mt-2">
                      Loading available disliked food items...
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="food-list">
                      <div className="food-card">
                        {dislikedFoods.map((food) => (
                          <div key={food.id} className="food-bx">
                            <input
                              type="checkbox"
                              className="d-none"
                              id={`dislike-${food.id}`}
                              checked={selectedDislikes.includes(
                                food.ingredients_name
                              )}
                              onChange={() =>
                                handleDislikeToggle(food.ingredients_name)
                              }
                            />
                            <label
                              htmlFor={`dislike-${food.id}`}
                              className={
                                selectedDislikes.includes(food.ingredients_name)
                                  ? "selected"
                                  : ""
                              }
                            >
                              {food.ingredients_name}
                              {selectedDislikes.includes(
                                food.ingredients_name
                              ) && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleRemoveDislike(food.ingredients_name);
                                    }}
                                  >
                                    <img src="/images/close.svg" alt="Remove" />
                                  </button>
                                )}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="custom-frm-bx mt-4 px-135">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="If other (please specify)"
                        value={customDislike}
                        onChange={handleCustomDislikeChange}
                        onKeyPress={handleKeyPress}
                      />
                    </div>

                    {dislikedFoods.length === 0 && !loading && (
                      <div className="text-center py-4">
                        <p>No disliked food items available at the moment.</p>
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

export default DislikesPage;
