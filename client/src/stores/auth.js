import { defineStore } from 'pinia';
import axios from 'axios';

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

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    isInitialized: false
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    currentUser: (state) => state.user
  },

  actions: {
    async initialize() {
      if (this.isInitialized) return;
      
      const token = localStorage.getItem('token');
      if (token) {
        this.token = token;
        this.user = mockUser;
      }
      
      this.isInitialized = true;
    },
    
    async login(credentials) {
      // Mock login - always succeed
      this.token = 'mock-token-' + Date.now();
      this.user = mockUser;
      
      localStorage.setItem('token', this.token);
      
      return { success: true };
    },
    
    async register(userData) {
      // Mock registration - always succeed
      this.token = 'mock-token-' + Date.now();
      this.user = {
        ...mockUser,
        firstName: userData.fullName.split(' ')[0],
        lastName: userData.fullName.split(' ').slice(1).join(' ') || 'User',
        email: userData.email
      };
      
      localStorage.setItem('token', this.token);
      
      return { success: true };
    },
    
    async fetchUser() {
      // Mock fetch user - always return mock user
      this.user = mockUser;
      return mockUser;
    },
    
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
    }
  }
}); 