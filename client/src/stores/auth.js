import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { mockAuthService } from '../services/mockAuth';

// Mock user data
const mockUser = {
  id: '1',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  profile: {
    bio: 'A test user for frontend development',
    skills: ['JavaScript', 'Vue.js', 'React', 'Node.js']
  }
};

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const token = ref(localStorage.getItem('token'));
  const isInitialized = ref(false);

  const isAuthenticated = computed(() => !!token.value);

  const setToken = (newToken) => {
    token.value = newToken;
    localStorage.setItem('token', newToken);
  };

  const clearToken = () => {
    token.value = null;
    localStorage.removeItem('token');
  };

  const initialize = async () => {
    if (token.value) {
      try {
        const userData = await mockAuthService.getProfile();
        user.value = userData;
      } catch (error) {
        console.error('Failed to initialize auth state:', error);
        clearToken();
      }
    }
    isInitialized.value = true;
  };

  const login = async (credentials) => {
    try {
      const { token: newToken, user: userData } = await mockAuthService.login(credentials);
      setToken(newToken);
      user.value = userData;
      return userData;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const { token: newToken, user: newUser } = await mockAuthService.register(userData);
      setToken(newToken);
      user.value = newUser;
      return newUser;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    user.value = null;
    clearToken();
  };

  const getUserProfile = async () => {
    try {
      const userData = await mockAuthService.getProfile();
      user.value = userData;
      return userData;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      throw error;
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const userData = await mockAuthService.updateProfile(profileData);
      user.value = userData;
      return userData;
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    isInitialized,
    initialize,
    login,
    register,
    logout,
    getUserProfile,
    updateProfile
  };
}); 