# TROMS Onboarding Flow

## Overview
This is a comprehensive 25-step onboarding system for the TROMS fitness app that collects user information and creates a personalized fitness profile.

## Key Features

### ✅ **Centralized State Management**
- Uses React Context for global state management
- Data persists in localStorage across sessions
- Automatic step validation and progression

### ✅ **API Integration**
- Centralized API service (`lib/api.js`) for easy endpoint management
- Social login with Google/Apple
- Dynamic equipment fetching based on workout location
- Final user profile creation

### ✅ **Smart Authentication Flow**
- Detects new vs existing users from API response
- New users: Complete onboarding flow
- Existing users: Skip to dashboard/BMR page

### ✅ **Comprehensive Validation**
- Step-by-step validation
- Age calculation with constraints (13-100 years)
- Weight/height conversion (Imperial ↔ Metric)
- Required field validation

### ✅ **User Experience**
- Progress indicator showing current step (X/25)
- Loading states and error handling
- Alerts for user feedback
- Responsive design

## Onboarding Flow Steps

1. **Register** (`/register`) - Social login (Google/Apple)
2. **Select Gender** (`/select-gender`) - Male/Female selection
3. **Birth Date** (`/borndate`) - Date picker with age calculation
4. **Training Days** (`/training-days`) - 1-7 days per week
5. **Feedback** (`/feedback`) - True/false feedback preference
6. **Weight** (`/weight`) - Height & weight with unit toggle
7. **Weight Goal** (`/weight-goal`) - LOSE_WEIGHT, MAINTAIN, GAIN_WEIGHT
8. **Desired Weight** (`/desired-weight`) - Target weight
9. **Workout Location** (`/workout-location`) - Home, Gym, Other
10. **Equipment** (`/equipment`) - Dynamic equipment selection based on location
11. **Goal Reach** (`/goal-reach`) - Reaching goals input
12. **Realistic Target** (`/realistic-target`) - Realistic target setting
13. **Result TROM** (`/result-trom`) - Results page
14. **Achieve Goal** (`/achieve-goal`) - Goal achievement
15. **Preferred Diet** (`/preferred-diet`) - Diet type selection
16. **Favorite Food** (`/favorite-food`) - Cheat meals from API
17. **Cooking** (`/cooking`) - Cooking level
18. **Accomplish** (`/accomplish`) - Accomplishment goals
19. **Allergies** (`/allergies`) - Allergic food items from API
20. **Dislikes** (`/dislikes`) - Disliked food items from API
21. **Injuries** (`/injuries`) - Injury list from API
22. **Crash Goal** (`/crash-goal`) - Static page
23. **Approach** (`/approach`) - **Final API submission**
24. **BMR** (`/bmr`) - BMR calculation

## API Endpoints Used

### Authentication
```javascript
POST /api/v1/auth/social-login
// Payload: { email, username, platform }
// Response: { success, message, result }
```

### Equipment (Dynamic)
```javascript
GET /api/v1/workout/accesible-equipments/{location}
// location: home, gym, outdoors
```

### Food Data
```javascript
GET /api/v1/food/cheat-meals-list
GET /api/v1/food/allergic-food-items-list  
GET /api/v1/food/disliked-food-items-list
```

### Health Data
```javascript
GET /api/v1/workout/get-injuries-from-db
```

### Final Submission
```javascript
POST /api/v1/users/create-user-info
// Comprehensive payload with all collected data
```

## Key Components

### 1. **OnboardingContext** (`context/OnboardingContext.js`)
- Global state management
- Step validation
- Data persistence
- Helper functions

### 2. **API Service** (`lib/api.js`)
- Centralized API calls
- Error handling
- Base URL configuration

### 3. **Alert Component** (`Components/Alert.js`)
- User feedback
- Auto-dismiss
- Multiple types (success, error, warning, info)

## Smart User Flow Logic

### New User Flow:
```
Social Login → "User information is required" → Complete Onboarding → BMR
```

### Existing User Flow:
```
Social Login → "Welcome back" → Skip to BMR/Dashboard
```

## Data Collection & Validation

### Critical Validations:
- **Age**: Must be 13-100 years old
- **Weight**: Reasonable ranges (30-300kg or 60-600lbs)
- **Height**: Reasonable ranges (100-250cm or 3'0"-8'6")
- **Equipment**: At least one selection required
- **Required Fields**: All steps must be completed before final submission

### Unit Conversion:
- **Weight**: lbs ↔ kg (factor: 0.453592)
- **Height**: ft/in ↔ cm (factor: 2.54)

## Final API Payload Structure

```javascript
{
  gender: "MALE",
  db: "1993-03-15T00:00:00.000Z",
  age: 32,
  trainingDay: 7,
  weightGoal: "GAIN_WEIGHT",
  desiredWeight: 62.59574706,
  height: 155.7528,
  weight: 61.23496995,
  weeklyWeightLossGoal: 1.5,
  reachingGoals: "Too busy.",
  accomplish: ["STAY_ACTIVE_DAILY"],
  isNotification: false,
  dietType: "VEGETARIAN",
  workoutLocation: "HOME",
  feedback: false,
  ratting: 0.0,
  unit: "lbs",
  allergic_food_items: ["peanuts", "mushrooms"],
  disliked_food_items: ["Tomatoes", "boiled eggs"],
  injuries: ["Arthritis", "HIP disCOMFORT"],
  cheat_meal_food_items: ["🍫 Chocolate Bar", "🍕 Pizza"],
  accessible_equipments: ["689608ee1952a397aa181d3b"],
  cooking_level: "Beginner"
}
```

## Usage Instructions

### 1. **Start the Development Server**
```bash
npm run dev
```

### 2. **Begin Onboarding**
- Navigate to `/register`
- Click Google or Apple login
- Follow the step-by-step flow

### 3. **Monitor Progress**
- Check browser console for API calls
- View state in React DevTools
- Progress shown at bottom (X/25)

### 4. **API Configuration**
- Modify `lib/api.js` to change base URL
- Update endpoints as needed
- Add authentication headers if required

## Error Handling

- **Network Errors**: Graceful fallback with retry options
- **Validation Errors**: Clear user feedback with specific messages
- **API Errors**: Display server error messages
- **Missing Data**: Automatic redirection to incomplete steps

## Future Enhancements

1. **Add Authentication Tokens**: Store and use JWT tokens
2. **Offline Support**: Cache data for offline completion
3. **Progress Backup**: Cloud backup of onboarding progress
4. **A/B Testing**: Different onboarding flows
5. **Analytics**: Track step completion rates
6. **Personalization**: Dynamic questions based on previous answers

## Testing the Flow

1. Start with `/register`
2. Use the provided social login
3. Complete each step sequentially
4. Monitor the final API call in `/approach`
5. Verify data persistence by refreshing pages

The system is designed to be robust, user-friendly, and easily maintainable for future updates. 