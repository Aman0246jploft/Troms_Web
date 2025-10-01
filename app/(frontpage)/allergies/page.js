"use client";

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
  // const [selectedAllergies, setSelectedAllergies] = useState(
  //   state.allergicFoodItems || []
  // );
  const [selectedAllergies, setSelectedAllergies] = useState([]);

  const [customAllergy, setCustomAllergy] = useState("");
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  useEffect(() => {
    if (state.currentStep !== 26) {
      updateStep(27);
    }
  }, [state.currentStep]);

  useEffect(() => {
    // Load previously selected allergies from context/localStorage
    if (state.allergicFoodItems && state.allergicFoodItems.length > 0) {
      // Separate predefined allergies from custom allergies
      const predefinedAllergies = [];
      let customAllergy = "";

      state.allergicFoodItems.forEach((allergy) => {
        // Check if this allergy matches any of the fetched allergic foods
        // If not, it's likely a custom allergy
        const isPredefined = allergicFoods.some(
          (food) => food.ingredients_name === allergy
        );
        if (isPredefined || allergicFoods.length === 0) {
          // Include if it's predefined or if we haven't loaded foods yet
          predefinedAllergies.push(allergy);
        }
        // Comment out the old custom allergy loading logic
        // else {
        //   // This is likely a custom allergy
        //   customAllergy = allergy;
        // }
      });

      setSelectedAllergies(predefinedAllergies);
    }

    // Load custom allergy from the new field
    if (state.allergic_food_other_item) {
      setCustomAllergy(state.allergic_food_other_item);
    }
  }, [state.allergicFoodItems, state.allergic_food_other_item, allergicFoods]);

  useEffect(() => {
    if (!state.isAuthChecked) return; // wait for auth check

    if (state.isAuthenticated === false) {
      router.push("/register");
      return;
    }
    if (!state.accomplish || state.accomplish.length === 0) {
      router.push("/accomplish");
      return;
    }
  }, [
    state.isAuthChecked,
    state.isAuthenticated,
    state.accomplish,
    state.currentStep,
    router,
    updateStep,
  ]);

  useEffect(() => {
    fetchAllergicFoodItems();
  }, []);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
  };

  const hideAlert = () => {
    setAlert({ show: false, type: "", message: "" });
  };

  const fetchAllergicFoodItems = async () => {
    setLoading(true);
    hideAlert();

    try {
      const response = await apiService.getAllergicFoodItems();

      if (response.success) {
        const apiAllergies = response.result || [];
        // Only set API allergies, don't add custom ones to the list
        setAllergicFoods(apiAllergies);
      } else {
        showAlert(
          "error",
          "Failed to load allergic food items. Please try again."
        );
      }
    } catch (error) {
      console.error("Allergic food items fetch error:", error);
      showAlert(
        "error",
        "Failed to load allergic food items. Please check your internet connection."
      );
    } finally {
      setLoading(false);
    }
  };

  // const handleAllergyToggle = (allergyName) => {
  //   setSelectedAllergies((prev) => {
  //     const newSelection = prev.includes(allergyName)
  //       ? prev.filter((name) => name !== allergyName)
  //       : [...prev, allergyName];

  //     updateField("allergicFoodItems", newSelection);
  //     return newSelection;
  //   });
  //   hideAlert();
  // };

  const handleAllergyToggle = (allergyName) => {
    setSelectedAllergies((prev) => {
      const newSelection = prev.includes(allergyName)
        ? prev.filter((name) => name !== allergyName)
        : [...prev, allergyName];

      // Only update context after state is set
      updateField("allergicFoodItems", newSelection);
      return newSelection;
    });
  };

  // Handle custom allergy input changes
  const handleCustomAllergyChange = (e) => {
    const value = e.target.value;
    setCustomAllergy(value);
    // Store the input value in context immediately
    updateField("allergic_food_other_item", value);
  };

  const handleRemoveAllergy = (allergyName) => {
    const newSelection = selectedAllergies.filter(
      (name) => name !== allergyName
    );
    setSelectedAllergies(newSelection);
    updateField("allergicFoodItems", newSelection);
  };

  const handleContinue = (e) => {
    e.preventDefault();

    // Check if either predefined allergies are selected or custom allergy is entered
    // Check both local state and context state to ensure we catch all cases
    const hasLocalSelection =
      selectedAllergies.length > 0 || customAllergy.trim();
    const hasContextSelection =
      (state.allergicFoodItems && state.allergicFoodItems.length > 0) ||
      state.allergic_food_other_item;
    const hasSelection = hasLocalSelection || hasContextSelection;

    if (!hasSelection) {
      showAlert(
        "warning",
        "Please select your allergies or enter a custom allergy."
      );
      return;
    }

    // Update the onboarding context with selected allergies and custom input separately
    updateField("allergicFoodItems", selectedAllergies);
    updateField("allergic_food_other_item", customAllergy.trim());

    router.push("/dislikes");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // Don't add to list automatically, just save the input value
      // User can manually select/add items if needed
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
                    <button
      type="button"
      onClick={() => router.back()}
      className="new_back_btn"
    >
                  Previous
                </button>
                <p className="text-uppercase mb-3">Allergies</p>
                <h3 className="mb-4">
                  Do you have any food allergies <br /> we should be aware of?
                </h3>

                {loading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">
                        Loading allergic food items...
                      </span>
                    </div>
                    <p className="mt-2">
                      Loading available allergic food items...
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="food-list">
                      <div className="food-card ">
                        {allergicFoods.map((food) => (
                          <div key={food.id} className="food-bx">
                            <input
                              type="checkbox"
                              className="d-none"
                              id={`allergy-${food.id}`}
                              checked={selectedAllergies.includes(
                                food.ingredients_name
                              )}
                              onChange={() =>
                                handleAllergyToggle(food.ingredients_name)
                              }
                            />
                            <label
                              htmlFor={`allergy-${food.id}`}
                              className={
                                selectedAllergies.includes(
                                  food.ingredients_name
                                )
                                  ? "selected"
                                  : ""
                              }
                            >
                              {food.ingredients_name}
                              {selectedAllergies.includes(
                                food.ingredients_name
                              ) && (
                                <></>
                                // <button
                                //   type="button"
                                //   onClick={(e) => {
                                //     e.preventDefault();
                                //     handleRemoveAllergy(food.ingredients_name);
                                //   }}
                                // >
                                //   <img src="/images/close.svg" alt="Remove" />
                                // </button>
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
                        value={customAllergy}
                        onChange={handleCustomAllergyChange}
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
                    disabled={
                      loading ||
                      (selectedAllergies.length === 0 &&
                        !customAllergy.trim() &&
                        !state.allergicFoodItems?.length &&
                        !state.allergic_food_other_item)
                    }
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
