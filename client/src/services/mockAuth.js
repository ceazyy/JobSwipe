// Mock user data
const mockUsers = [
  {
    id: '1',
    email: 'demo@example.com',
    firstName: 'Demo',
    lastName: 'User',
    avatar: null
  }
];

// Mock tokens
const mockTokens = {
  'demo@example.com': 'mock-jwt-token-demo'
};

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mockAuthService = {
  async login(credentials) {
    await delay(500); // Simulate network delay
    
    const user = mockUsers.find(u => u.email === credentials.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    return {
      token: mockTokens[user.email],
      user
    };
  },

  async register(userData) {
    await delay(500);
    
    if (mockUsers.some(u => u.email === userData.email)) {
      throw new Error('User already exists');
    }
    
    const newUser = {
      id: String(mockUsers.length + 1),
      ...userData,
      avatar: null
    };
    
    mockUsers.push(newUser);
    mockTokens[userData.email] = `mock-jwt-token-${newUser.id}`;
    
    return {
      token: mockTokens[userData.email],
      user: newUser
    };
  },

  async getProfile() {
    await delay(300);
    return mockUsers[0];
  },

  async updateProfile(profileData) {
    await delay(500);
    Object.assign(mockUsers[0], profileData);
    return mockUsers[0];
  }
}; 