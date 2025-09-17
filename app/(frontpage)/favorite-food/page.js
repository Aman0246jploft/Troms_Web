"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "../../../context/OnboardingContext";
import { apiService } from "../../../lib/api";
import Alert from "../../../Components/Alert";

function FavoriteFoodPage() {
  const router = useRouter();
  const { state, updateField, updateStep, isStepValid } = useOnboarding();
  const [cheatMeals, setCheatMeals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(
    state.cheatMealFoodItems && state.cheatMealFoodItems.length > 0 
      ? state.cheatMealFoodItems[0] 
      : ""
  );
  const [customFood, setCustomFood] = useState(
    state.cheat_meal_food_other_item || ""
  );
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  useEffect(() => {
    if (!state.isAuthChecked) return; // wait for auth check

    if (state.isAuthenticated === false) {
      router.push("/register");
      return;
    }

    if (!state.dietType) {
      router.push("/preferred-diet");
      return;
    }

    // Only update step if it's not already set
    if (state.currentStep !== 16) {
      updateStep(17);
    }
  }, [
    state.isAuthChecked,
    state.isAuthenticated,
    state.dietType,
    state.currentStep,
    router,
    updateStep,
  ]);

  useEffect(() => {
    fetchCheatMeals();
  }, []);

  // Handle prefilling the input field when returning to page
  useEffect(() => {
    // First, handle custom food input if it exists
    if (state.cheat_meal_food_other_item) {
      setCustomFood(state.cheat_meal_food_other_item);
      setSelectedMeal(""); // Clear any predefined selection when custom food exists
      return; // Exit early since custom food takes priority
    }

    // Then handle predefined selections
    if (state.cheatMealFoodItems && state.cheatMealFoodItems.length > 0) {
      const savedFood = state.cheatMealFoodItems[0];
      
      // Check if the saved food is in the predefined list
      const isInPredefinedList = cheatMeals.some(meal => meal.name === savedFood);
      
      if (isInPredefinedList) {
        // If it's in the predefined list, clear the input and select from list
        setCustomFood("");
        setSelectedMeal(savedFood);
      } else if (savedFood) {
        // If it's not in the predefined list, it's a custom food - prefill the input
        setCustomFood(savedFood);
        setSelectedMeal("");
      }
    }
  }, [cheatMeals, state.cheatMealFoodItems, state.cheat_meal_food_other_item]);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
  };

  const hideAlert = () => {
    setAlert({ show: false, type: "", message: "" });
  };

  const fetchCheatMeals = async () => {
    setLoading(true);
    hideAlert();

    try {
      const response = await apiService.getCheatMeals();

      if (response.success) {
        // Store the categories for displaying headings
        setCategories(response.result || []);
        
        // Extract all meals from the nested structure
        const apiMeals = [];
        
        // Flatten the list_data from each category
        (response.result || []).forEach((category) => {
          if (category.list_data && Array.isArray(category.list_data)) {
            apiMeals.push(...category.list_data);
          }
        });

        // Sort by user_count (popularity) descending
        const sortedMeals = apiMeals.sort(
          (a, b) => b.user_count - a.user_count
        );
        setCheatMeals(sortedMeals);
      } else {
        showAlert("error", "Failed to load cheat meals. Please try again.");
      }
    } catch (error) {
      console.error("Cheat meals fetch error:", error);
      showAlert(
        "error",
        "Failed to load cheat meals. Please check your internet connection."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleMealSelect = (mealName) => {
    // Toggle selection - if already selected, deselect it
    if (selectedMeal === mealName) {
      setSelectedMeal("");
      updateField("cheatMealFoodItems", []); // Clear the array when deselecting
    } else {
      setSelectedMeal(mealName);
      updateField("cheatMealFoodItems", [mealName]); // Store as array for compatibility
    }
    setCustomFood(""); // Clear the input field when selecting/deselecting from list
    updateField("cheat_meal_food_other_item", ""); // Clear custom food when selecting predefined meal
    hideAlert();
  };

  const handleCustomFoodChange = (e) => {
    const value = e.target.value;
    setCustomFood(value);
    
    // Clear predefined meal selection when typing custom food
    if (value.trim()) {
      setSelectedMeal("");
      updateField("cheatMealFoodItems", []); // Clear predefined selection
    }
    
    // Store the input value in context immediately with new key
    updateField("cheat_meal_food_other_item", value);
    hideAlert();
  };

  const handleKeyPress = (e) => {
    // Remove the auto-add behavior on Enter
    if (e.key === "Enter") {
      e.preventDefault();
      // Just let the onChange handle the selection
    }
  };

  const handleContinue = (e) => {
    e.preventDefault();

    // Check if either a meal is selected from list or custom food is entered
    // Check both local state and context state to ensure we catch all cases
    const hasLocalSelection = selectedMeal || customFood.trim();
    const hasContextSelection = (state.cheatMealFoodItems && state.cheatMealFoodItems.length > 0) || state.cheat_meal_food_other_item;
    const hasSelection = hasLocalSelection || hasContextSelection;
    console.log("hiiii", hasSelection)
    
    if (!hasSelection) {
      showAlert(
        "warning",
        "Please select your favorite food or enter a custom food."
      );                    
      return;
    }

    // Store selected meal in original array and custom input in separate field
    if (selectedMeal && !customFood.trim()) {
      updateField("cheatMealFoodItems", [selectedMeal]);
      updateField("cheat_meal_food_other_item", ""); // Clear custom food
    } else if (customFood.trim()) {
      updateField("cheatMealFoodItems", []); // Clear predefined selection
      updateField("cheat_meal_food_other_item", customFood.trim());
    }


      updateStep(18);
      router.push("/cooking");
   
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
                <p className="text-uppercase mb-5">Favourite Food</p>
                <h3 className="mb-4">
                  What's your favourite treat? <br /> We'll find a smart way to
                  fit it in
                </h3>

                {loading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">
                        Loading cheat meals...
                      </span>
                    </div>
                    <p className="mt-2">Loading available cheat meals...</p>
                  </div>
                ) : (
                  <>
                   <div className="food-list">
                     {categories.map((category, categoryIndex) => (
                       <div key={categoryIndex} className="category-section">
                         {/* <h6 className="text-sm mb-3">{category.name}</h6> */}
                         <div className="food-card">
                                                       {(category.list_data || []).map((meal) => (
                              <div key={meal.id} className="food-bx">
                                <input
                                  type="checkbox"
                                  className="d-none"
                                  id={`meal-${meal.id}-${meal.name.replace(
                                    /\s+/g,
                                    "-"
                                  )}`}
                                  checked={selectedMeal === meal.name}
                                  onChange={() => handleMealSelect(meal.name)}
                                />
                                <label
                                  htmlFor={`meal-${meal.id}-${meal.name.replace(
                                    /\s+/g,
                                    "-"
                                  )}`}
                                  className={
                                    selectedMeal === meal.name
                                      ? "selected"
                                      : ""
                                  }
                                >
                                  {meal.name}
                                </label>
                              </div>
                            ))}
                         </div>
                       </div>
                     ))}
                   </div>

                    <div className="custom-frm-bx mt-4 px-135">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="If other (please specify)"
                        value={customFood}
                        onChange={handleCustomFoodChange}
                        onKeyPress={handleKeyPress}
                      />
                    </div>

                    {categories.length === 0 && !loading && (
                      <div className="text-center py-4">
                        <p>No cheat meals available at the moment.</p>
                      </div>
                    )}
                  </>
                )}

                                 <div className="text-center mt-3">
                   <button
                     onClick={handleContinue}
                     className="custom-btn continue-btn"
                     disabled={(!selectedMeal && !customFood.trim() && !state.cheatMealFoodItems?.length && !state.cheat_meal_food_other_item) || loading}
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

export default FavoriteFoodPage;
