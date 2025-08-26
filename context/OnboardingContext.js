"use client";

import { createContext, useContext, useReducer, useEffect } from "react";

const OnboardingContext = createContext();

const initialState = {
  // Step tracking
  currentStep: 1,
  totalSteps: 25,

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
  feedback: false,
  weight: 0,
  weightUnit: "lbs",
  weightGoal: "",
  desiredWeight: 0,
  height: 0,
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
  weeklyWeightLossGoal: 1.5,

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

  // Convert to same unit
  let currentWeightInUnit, desiredWeightInUnit;
  if (state.weightUnit === "kg") {
    currentWeightInUnit = currentWeight;
    desiredWeightInUnit = desiredWeight;
  } else {
    currentWeightInUnit = currentWeight * 2.20462;
    desiredWeightInUnit = desiredWeight * 2.20462;
  }

  if (goal === "LOSE_WEIGHT") {
    return desiredWeightInUnit < currentWeightInUnit;
  } else if (goal === "GAIN_WEIGHT") {
    return desiredWeightInUnit > currentWeightInUnit;
  } else if (goal === "MAINTAIN") {
    const tolerance = state.weightUnit === "kg" ? 2 : 5;
    return Math.abs(desiredWeightInUnit - currentWeightInUnit) <= tolerance;
  }

  return false;
}

export function OnboardingProvider({ children }) {
  const [state, dispatch] = useReducer(onboardingReducer, initialState);

  // Load state from localStorage on mount
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
    if (typeof window !== "undefined") {
      localStorage.setItem("onboardingState", JSON.stringify(state));
    }
  }, [state]);

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
        case 5: // Feedback
          return true; // boolean field, always valid
        case 6: // Weight
          return state.weight > 0;
        case 7: // Weight goal
          return state.weightGoal !== "";
        case 8: // Desired weight
          return state.desiredWeight > 0 && validateDesiredWeight(state);
        case 9: // Workout location
          return state.workoutLocation !== "";
        case 10: // Equipment
          return state.selectedEquipments.length > 0;
        case 11: // Goal reach
          return state.reachingGoals !== "";
        case 12: // Realistic target
          return state.realisticTarget > 0;
        default:
          return true;
      }
    },

    // Validate desired weight based on goal
    // validateDesiredWeight: (state) => {
    //   if (!state.weightGoal || !state.desiredWeight || !state.weight) return false;

    //   const currentWeight = state.weight;
    //   const desiredWeight = state.desiredWeight;
    //   const goal = state.weightGoal;

    //   // Convert to same unit for comparison
    //   let currentWeightInUnit, desiredWeightInUnit;

    //   if (state.weightUnit === 'kg') {
    //     currentWeightInUnit = currentWeight;
    //     desiredWeightInUnit = desiredWeight;
    //   } else {
    //     // Convert kg to lbs for comparison
    //     currentWeightInUnit = currentWeight * 2.20462;
    //     desiredWeightInUnit = desiredWeight * 2.20462;
    //   }

    //   if (goal === 'LOSE_WEIGHT') {
    //     return desiredWeightInUnit < currentWeightInUnit;
    //   } else if (goal === 'GAIN_WEIGHT') {
    //     return desiredWeightInUnit > currentWeightInUnit;
    //   } else if (goal === 'MAINTAIN') {
    //     const tolerance = state.weightUnit === 'kg' ? 2 : 5;
    //     return Math.abs(desiredWeightInUnit - currentWeightInUnit) <= tolerance;
    //   }

    //   return false;
    // },

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
