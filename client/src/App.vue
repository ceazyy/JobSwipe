<template>
  <div class="app">
    <!-- Navigation -->
    <nav class="navbar">
      <div class="container navbar-container">
        <div class="navbar-brand">
          <router-link to="/" class="navbar-logo-link">
            <span class="navbar-title">JobSwipe</span>
          </router-link>
        </div>
        
        <div class="navbar-menu">
          <router-link
            to="/"
            class="navbar-item"
            active-class="navbar-item-active"
          >
            Home
          </router-link>
          <router-link
            to="/swipe"
            class="navbar-item"
            active-class="navbar-item-active"
          >
            Swipe Jobs
          </router-link>
          <router-link
            to="/matches"
            class="navbar-item"
            active-class="navbar-item-active"
          >
            Matches
          </router-link>
          <router-link
            to="/profile"
            class="navbar-item"
            active-class="navbar-item-active"
          >
            Profile
          </router-link>
        </div>
        
        <div class="navbar-end">
          <!-- User menu -->
          <div v-if="authStore.isAuthenticated" class="navbar-profile">
            <button
              @click="isUserMenuOpen = !isUserMenuOpen"
              class="navbar-avatar-btn"
            >
              <img
                class="navbar-avatar"
                :src="authStore.user?.avatar || '/src/assets/default-avatar.svg'"
                alt="User avatar"
              />
            </button>
            
            <div
              v-if="isUserMenuOpen"
              class="profile-menu"
            >
              <router-link
                to="/profile"
                class="profile-menu-item"
                @click="isUserMenuOpen = false"
              >
                Your Profile
              </router-link>
              <router-link
                to="/settings"
                class="profile-menu-item"
                @click="isUserMenuOpen = false"
              >
                Settings
              </router-link>
              <div class="profile-menu-divider"></div>
              <button
                @click="handleLogout"
                class="profile-menu-item"
              >
                Sign out
              </button>
            </div>
          </div>
          
          <div v-else class="navbar-auth">
            <router-link
              to="/login"
              class="btn-secondary mr-2"
            >
              Log in
            </router-link>
            <router-link
              to="/register"
              class="btn-primary"
            >
              Sign up
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main content -->
    <main class="main-content">
      <router-view></router-view>
    </main>
    
    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-brand">
            <span class="footer-title">JobSwipe</span>
          </div>
          <div class="footer-links">
            <a href="#" class="footer-link">About</a>
            <a href="#" class="footer-link">Privacy</a>
            <a href="#" class="footer-link">Terms</a>
            <a href="#" class="footer-link">Contact</a>
          </div>
        </div>
        <div class="footer-copyright">
          &copy; {{ currentYear }} JobSwipe. All rights reserved.
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'
import '@/assets/css/global.css'

const router = useRouter()
const authStore = useAuthStore()
const isUserMenuOpen = ref(false)
const currentYear = new Date().getFullYear()

const handleLogout = async () => {
  try {
    await authStore.logout()
    isUserMenuOpen.value = false
    router.push('/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

// Close profile menu when clicking outside
const handleClickOutside = (event) => {
  const profileMenu = document.querySelector('.profile-menu');
  const navbarAvatar = document.querySelector('.navbar-avatar-btn');
  
  if (profileMenu && navbarAvatar && 
      !profileMenu.contains(event.target) && 
      !navbarAvatar.contains(event.target)) {
    isUserMenuOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.navbar {
  background-color: var(--background-primary);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-3) 0;
  position: sticky;
  top: 0;
  z-index: var(--z-10);
}

.navbar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar-brand {
  display: flex;
  align-items: center;
}

.navbar-logo-link {
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-lg);
  color: var(--primary-color);
  text-decoration: none;
}

.navbar-title {
  color: var(--primary-color);
}

.navbar-menu {
  display: flex;
  gap: var(--spacing-4);
}

.navbar-item {
  color: var(--text-secondary);
  font-weight: var(--font-weight-medium);
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  text-decoration: none;
  font-size: var(--font-size-sm);
}

.navbar-item:hover {
  color: var(--text-primary);
  background-color: var(--background-tertiary);
}

.navbar-item-active {
  color: var(--primary-color);
  background-color: rgba(var(--primary-rgb), 0.1);
}

.navbar-end {
  display: flex;
  align-items: center;
}

.navbar-auth {
  display: flex;
  gap: var(--spacing-2);
}

.navbar-profile {
  position: relative;
}

.navbar-avatar-btn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.navbar-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid var(--border-color);
  transition: border-color var(--transition-fast);
}

.navbar-avatar-btn:hover .navbar-avatar {
  border-color: var(--primary-color);
}

.profile-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: var(--spacing-2);
  background-color: var(--background-primary);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  width: 200px;
  z-index: var(--z-20);
  overflow: hidden;
}

.profile-menu-item {
  display: block;
  padding: var(--spacing-3) var(--spacing-4);
  color: var(--text-primary);
  transition: background-color var(--transition-fast);
  cursor: pointer;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  font-size: var(--font-size-sm);
  text-decoration: none;
}

.profile-menu-item:hover {
  background-color: var(--background-tertiary);
}

.profile-menu-divider {
  height: 1px;
  background-color: var(--border-color);
  margin: var(--spacing-2) 0;
}

.main-content {
  flex: 1;
  padding: var(--spacing-6) 0;
}

.footer {
  background-color: var(--background-primary);
  border-top: 1px solid var(--border-color);
  padding: var(--spacing-6) 0 var(--spacing-4);
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-4);
}

.footer-brand {
  display: flex;
  align-items: center;
}

.footer-title {
  font-weight: var(--font-weight-semibold);
  color: var(--primary-color);
}

.footer-links {
  display: flex;
  gap: var(--spacing-4);
}

.footer-link {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  transition: color var(--transition-fast);
  text-decoration: none;
}

.footer-link:hover {
  color: var(--text-primary);
}

.footer-copyright {
  text-align: center;
  color: var(--text-tertiary);
  font-size: var(--font-size-sm);
}

@media (max-width: 768px) {
  .navbar-menu {
    display: none;
  }
  
  .footer-content {
    flex-direction: column;
    gap: var(--spacing-4);
    text-align: center;
  }
  
  .footer-links {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style> 