"use client";

import { createContext, useContext, useReducer, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
const OnboardingContext = createContext();

const initialState = {
  // Step tracking
  currentStep: 1,
  totalSteps: 31, // Updated to include health conditions, train-more, job-type, and moveAtwork steps

  // User data
  isAuthenticated: false,
  needsOnboarding: true, // true if user needs to complete onboarding
  user: {
    email: "",
    username: "",
    platform: "ios",
    userInfoId: "",
  },

  // Onboarding data
  gender: "",
  dateOfBirth: "",
  age: 0,
  trainingDays: 3,
  feedback: true,
  weight: 0,
  weightUnit: "kg",
  weightGoal: "",
  desiredWeight: 0,
  height: 0,
  unitSystem: "metric", // Global unit system: "metric" or "imperial"
  workoutLocation: "",
  selectedEquipments: [],
  reachingGoals: "",
  // realisticTarget: 0,
  accomplish: [],
  isNotification: false,
  dietType: "",
  cheatMealFoodItems: [],
  cookingLevel: "",
  allergicFoodItems: [],
  dislikedFoodItems: [],
  injuries: [],
  
  // Other item fields for custom inputs
  allergic_food_other_item: "",
  disliked_food_other_item: "",
  injuries_other: "",
  cheat_meal_food_other_item: "",
  weeklyWeightLossGoal: 1.5,
  
  // Location data
  selectedCountry: null, // { countryName, flagUrl, cities }
  selectedCity: "",

  // Health conditions data
  healthyConditions: [],

  // Budget and work shift data
  budget: "",
  occupation: "",
  workShift: "",
  workActivityLevel: "",

  // Train more than once data
  trainMoreThanOnce: {
    isMoreThanOnce: false,
    specificDays: []
  },

  // Loading states
  loading: false,
  error: null,
};

function onboardingReducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };

    case "SET_USER":
      return {
        ...state,
        user: { ...state.user, ...action.payload.userData },
        isAuthenticated: true,
        needsOnboarding:
          action.payload.needsOnboarding !== undefined
            ? action.payload.needsOnboarding
            : state.needsOnboarding,
        error: null,
      };

    case "UPDATE_STEP":
      return { ...state, currentStep: action.payload };

    case "UPDATE_FIELD":
      return { ...state, [action.field]: action.value };

    case "UPDATE_MULTIPLE_FIELDS":
      return { ...state, ...action.payload };

    case "RESET_STATE":
      return initialState;

    case "CALCULATE_AGE":
      const today = new Date();
      const birthDate = new Date(action.payload);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      return {
        ...state,
        dateOfBirth: action.payload,
        age: age,
      };

    default:
      return state;
  }
}

// put this above OnboardingProvider

function validateDesiredWeight(state) {
  if (!state.weightGoal || !state.desiredWeight || !state.weight) return false;

  const currentWeight = state.weight;
  const desiredWeight = state.desiredWeight;
  const goal = state.weightGoal;
  const isMetric = state.unitSystem === "metric";

  // Convert current weight to display unit if needed
  let currentWeightInDisplayUnit = currentWeight;
  if (state.weightUnit === 'kg' && !isMetric) {
    // Convert kg to lbs for display
    currentWeightInDisplayUnit = currentWeight / 0.453592;
  } else if (state.weightUnit === 'lbs' && isMetric) {
    // Convert lbs to kg for display
    currentWeightInDisplayUnit = currentWeight * 0.453592;
  }

  // Both weights should now be in the same unit (display unit)
  if (goal === "LOSE_WEIGHT") {
    return desiredWeight < currentWeightInDisplayUnit && 
           desiredWeight >= (currentWeightInDisplayUnit - 10);
  } else if (goal === "GAIN_WEIGHT") {
    return desiredWeight > currentWeightInDisplayUnit && 
           desiredWeight <= (currentWeightInDisplayUnit + 10);
  } else if (goal === "MAINTAIN") {
    // For maintenance, desired weight must be exactly the current weight
    return Math.abs(desiredWeight - currentWeightInDisplayUnit) <= 0.1;
  }

  return false;
}

export function OnboardingProvider({ children }) {
const isFirstLoad = useRef(true);
  const router = useRouter();

  const [state, dispatch] = useReducer(onboardingReducer, initialState);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem("onboardingState");
      if (savedState) {
        try {
          const parsedState = JSON.parse(savedState);
          dispatch({ type: "UPDATE_MULTIPLE_FIELDS", payload: parsedState });
        } catch (error) {
          console.error("Error loading saved state:", error);
        }
      }
    }
  }, []);

  // Save state to localStorage when it changes
useEffect(() => {
  if (isFirstLoad.current) {
    isFirstLoad.current = false; // skip saving on first render
    return;
  }
  if (typeof window !== "undefined") {
    localStorage.setItem("onboardingState", JSON.stringify(state));
  }
}, [state]);

  // Validate user credentials and redirect to register if missing
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    // Skip validation on certain pages to avoid infinite redirects
    const currentPath = window.location.pathname;
    const skipValidationPaths = ["/register", "/auth", "/"];
    
    if (skipValidationPaths.includes(currentPath)) return;
    
    // Only validate on onboarding pages
    const onboardingPaths = [
      "/select-gender", "/borndate", "/training-days", "/train-more", "/feedback",
      "/new-height", "/new-weight", "/weight-goal", "/new-desired-weight",
      "/workout-location", "/equipment", "/goal-reach", "/realistic-target",
      "/achieve-goal", "/preferred-diet", "/favorite-food", "/cooking",
      "/accomplish", "/health-conditions", "/choose-country", "/budget",
      "/job-type", "/moveAtwork", "/shift", "/allergies", "/dislikes",
      "/injuries", "/approach", "/bmr", "/subscriptions"
    ];
    
    const isOnboardingPage = onboardingPaths.some(path => currentPath.includes(path));
    
    if (!isOnboardingPage) return;
    
    // Check for user data from localStorage and state
    const checkUserData = () => {
      try {
        const savedState = localStorage.getItem("onboardingState");
        if (savedState) {
          const parsedState = JSON.parse(savedState);
          return parsedState.user || {};
        }
      } catch (error) {
        console.error("Error reading user data from localStorage:", error);
      }
      return {};
    };

    const currentUser = state.user || {};
    const localStorageUser = checkUserData();
    
    const userEmail = currentUser.email || localStorageUser.email;
    const userUsername = currentUser.username || localStorageUser.username;

    // If email or username is missing on an onboarding page, redirect to register
    if (!userEmail || !userUsername) {
      console.log("Missing user credentials on onboarding page - redirecting to register");
      router.push("/register");
    }
  }, [state.user, router]);


  const value = {
    state,
    dispatch,

    // Helper functions
    setLoading: (loading) =>
      dispatch({ type: "SET_LOADING", payload: loading }),
    setError: (error) => dispatch({ type: "SET_ERROR", payload: error }),
    setUser: (userData) => dispatch({ type: "SET_USER", payload: userData }),
    updateStep: (step) => dispatch({ type: "UPDATE_STEP", payload: step }),
    updateField: (field, value) =>
      dispatch({ type: "UPDATE_FIELD", field, value }),
    updateMultipleFields: (fields) =>
      dispatch({ type: "UPDATE_MULTIPLE_FIELDS", payload: fields }),
    calculateAge: (dateOfBirth) =>
      dispatch({ type: "CALCULATE_AGE", payload: dateOfBirth }),
    resetState: () => dispatch({ type: "RESET_STATE" }),
    
    // Unit system helper
    toggleUnitSystem: () => {
      const newUnitSystem = state.unitSystem === "metric" ? "imperial" : "metric";
      dispatch({ type: "UPDATE_FIELD", field: "unitSystem", value: newUnitSystem });
      
      // Also update weightUnit to match
      const newWeightUnit = newUnitSystem === "metric" ? "kg" : "lbs";
      dispatch({ type: "UPDATE_FIELD", field: "weightUnit", value: newWeightUnit });
      
      return newUnitSystem;
    },

    // Validation helpers
    isStepValid: (step) => {
      switch (step) {
        case 1: // Register
          return state.isAuthenticated;
        case 2: // Gender
          return state.gender !== "";
        case 3: // Birth date
          return state.dateOfBirth !== "" && state.age > 0;
        case 4: // Training days
          return state.trainingDays > 0;
        case 5: // Train more
          return state.trainMoreThanOnce !== undefined;
        case 6: // Feedback
          return state.feedback !== null; // boolean field, always valid
        case 7: // Height
          return state.height > 0;
        case 8: // Weight
          return state.weight > 0;
        case 9: // Weight goal
          return state.weightGoal !== "";
        case 10: // Desired weight
          // For MAINTAIN goal, desired weight is automatically set to current weight, so it's always valid
          if (state.weightGoal === "MAINTAIN") {
            return state.desiredWeight > 0;
          }
          return state.desiredWeight > 0 && validateDesiredWeight(state);
        case 11: // Workout location
          return state.workoutLocation !== "";
        case 12: // Equipment
          return state.selectedEquipments.length > 0;
        case 13: // Goal reach
          return state.reachingGoals !== "";
        case 14: // Realistic target
          return state.realisticTarget > 0;
        case 15: // Achieve goal
          return state.reachingGoals !== "";
        case 16: // Preferred diet
          return state.dietType !== "";
        case 17: // Favorite food
          return state.cheatMealFoodItems.length > 0;
        case 18: // Cooking
          return state.cookingLevel !== "";
        case 19: // Accomplish
          return state.accomplish.length > 0;
        case 20: // Health conditions (optional)
          return true; // Health conditions are optional
        case 21: // Choose country
          return state.selectedCountry !== null && state.selectedCity !== "";
        case 22: // Budget
          return state.budget !== "";
        case 23: // Occupation
          return state.occupation !== "";
        case 24: // Work Activity Level
          return state.workActivityLevel !== "";
        case 25: // Shift
          return state.workShift !== "";
        case 26: // Allergies
          return true; // Allergies are optional
        case 27: // Dislikes
          return true; // Dislikes are optional
        case 28: // Injuries
          return true; // Injuries are optional
        default:
          return true;
      }
    },

    // Get final payload for API
    getFinalPayload: () => {
      return {
        gender: state.gender.toUpperCase(),
        db: new Date(state.dateOfBirth).toISOString(),
        age: state.age,
        trainingDay: state.trainingDays,
        weightGoal: state.weightGoal,
        desiredWeight: state.desiredWeight,
        height: state.height,
        weight: state.weight,
        weeklyWeightLossGoal: state.weeklyWeightLossGoal,
        reachingGoals: state.reachingGoals,
        accomplish: state.accomplish,
        isNotification: state.isNotification,
        dietType: state.dietType,
        workoutLocation: state.workoutLocation.toUpperCase(),
        feedback: state.feedback,
        ratting: 0.0,
        unit: state.weightUnit,
        allergic_food_items: state.allergicFoodItems,
        disliked_food_items: state.dislikedFoodItems,
        injuries: state.injuries,
        cheat_meal_food_items: state.cheatMealFoodItems,
        accessible_equipments: state.selectedEquipments,
        cooking_level: state.cookingLevel,
        healthyConditions: state.healthyConditions,
        trainMoreThanOnce: state.trainMoreThanOnce,
        selectedCountry: state.selectedCountry,
        selectedCity: state.selectedCity,
        budget: state.budget,
        workShift: state.workShift,
        workActivityLevel: state.workActivityLevel,

        occupation: state.occupation,
        allergic_food_other_item:state.allergic_food_other_item,
        disliked_food_other_item:state.disliked_food_other_item,
        injuries_other:state.injuries_other,
        cheat_meal_food_other_item:state.cheat_meal_food_other_item,

      };
    },
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}
