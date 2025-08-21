const BASE_URL = 'http://stage.tasksplan.com:5010/api/v1';

class ApiService {
  constructor() {
    this.baseURL = BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body !== 'string') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      // if (!response.ok) {
      //   throw new Error(data.message || 'API request failed');
      // }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth APIs
  async socialLogin(payload) {
    // Ensure required fields are present
    const requiredPayload = {
      email: payload.email,
      username: payload.username,
      platform: payload.platform,
      ...(payload.userInfoId && { userInfoId: payload.userInfoId })
    };
    
    return this.request('/auth/social-login', {
      method: 'POST',
      body: requiredPayload,
    });
  }

  async createUserInfo(payload) {
    return this.request('/users/create-user-info', {
      method: 'POST',
      body: payload,
    });
  }

  // Equipment APIs
  async getEquipments(location) {
    return this.request(`/workout/accesible-equipments/${location}`);
  }

  // Food APIs
  async getCheatMeals() {
    return this.request('/food/cheat-meals-list');
  }

  async getAllergicFoodItems() {
    return this.request('/food/allergic-food-items-list');
  }

  async getDislikedFoodItems() {
    return this.request('/food/disliked-food-items-list');
  }

  // Injuries API
  async getInjuries() {
    return this.request('/workout/get-injuries-from-db');
  }
}

export const apiService = new ApiService();
export { BASE_URL }; 