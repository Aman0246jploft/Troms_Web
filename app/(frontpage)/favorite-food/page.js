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
  const [customFood, setCustomFood] = useState("");
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
      updateStep(16);
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

        // Add custom food if it was previously selected but not in API
        const customFoods = [];
        if (selectedMeal && !apiMeals.some((meal) => meal.name === selectedMeal)) {
          customFoods.push({
            id: `custom-${selectedMeal.replace(/\s+/g, "-").toLowerCase()}`,
            name: selectedMeal,
            user_count: 0,
            is_approved_by_admin: true,
          });
        }

        // Sort by user_count (popularity) descending, custom foods will be at the end
        const allMeals = [...apiMeals, ...customFoods];
        const sortedMeals = allMeals.sort(
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
    setSelectedMeal(mealName);
    updateField("cheatMealFoodItems", [mealName]); // Store as array for compatibility
    hideAlert();
  };

  const handleCustomFoodAdd = () => {
    if (customFood.trim()) {
      const newFood = customFood.trim();
      if (!cheatMeals.some((meal) => meal.name === newFood)) {
        // Add to the cheat meals list for immediate display
        const customFoodObj = {
          id: `custom-${Date.now()}`,
          name: newFood,
          user_count: 0,
          is_approved_by_admin: true,
        };
        setCheatMeals((prev) => [...prev, customFoodObj]);

        // Select this new custom food
        setSelectedMeal(newFood);
        updateField("cheatMealFoodItems", [newFood]);
        setCustomFood("");
        hideAlert();
      } else {
        showAlert("warning", "This food is already in the list.");
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCustomFoodAdd();
    }
  };

  const handleContinue = (e) => {
    e.preventDefault();

    if (!selectedMeal) {
      showAlert(
        "warning",
        "Please select your favorite food or cheat meal."
      );
      return;
    }

    if (isStepValid(16)) {
      updateStep(17);
      router.push("/cooking");
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
                         <h4 className="category-heading mb-3">{category.name}</h4>
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
                     
                     {/* Custom foods section */}
                     {cheatMeals.some(meal => meal.id.startsWith('custom-')) && (
                       <div className="category-section">
                         <h4 className="category-heading mb-3">Custom Foods</h4>
                         <div className="food-card">
                           {cheatMeals
                             .filter(meal => meal.id.startsWith('custom-'))
                             .map((meal) => (
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
                     )}
                   </div>

                    <div className="custom-frm-bx mt-4 px-135">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="If other (please specify)"
                        value={customFood}
                        onChange={(e) => setCustomFood(e.target.value)}
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
                     disabled={!selectedMeal || loading}
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
