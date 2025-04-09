<template>
  <div class="home">
    <div class="hero">
      <div class="hero-content">
        <h1>Welcome to JobMatch</h1>
        <p class="subtitle">Find your perfect job match with AI-powered recommendations</p>
        
        <div class="features">
          <div v-for="feature in features" :key="feature.title" class="feature-card">
            <div class="feature-icon">
              <i :class="feature.icon"></i>
            </div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </div>

        <div class="cta-section" v-if="!isAuthenticated">
          <router-link to="/register" class="btn-primary">Get Started</router-link>
          <router-link to="/login" class="btn-secondary">Sign In</router-link>
        </div>
        <div class="cta-section" v-else>
          <router-link to="/matches" class="btn-primary">View Matches</router-link>
          <router-link to="/swipe" class="btn-secondary">Swipe Jobs</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)

const features = [
  {
    icon: 'fas fa-robot',
    title: 'AI-Powered Matching',
    description: 'Our advanced AI analyzes your skills and preferences to find the perfect job matches.'
  },
  {
    icon: 'fas fa-bolt',
    title: 'Quick Apply',
    description: 'Apply to multiple jobs with a single click using your saved resume.'
  },
  {
    icon: 'fas fa-chart-line',
    title: 'Career Growth',
    description: 'Get matched with jobs that align with your career goals and growth potential.'
  },
  {
    icon: 'fas fa-bell',
    title: 'Smart Notifications',
    description: 'Receive alerts for new job matches and application updates.'
  }
]
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: var(--background-color);
}

.hero {
  padding: var(--spacing-xl) var(--spacing-md);
  background: linear-gradient(135deg, var(--primary-color), var(--primary-hover));
  color: white;
  text-align: center;
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: var(--spacing-md);
  color: white;
}

.subtitle {
  font-size: 1.25rem;
  margin-bottom: var(--spacing-xl);
  opacity: 0.9;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
  margin: var(--spacing-xl) 0;
}

.feature-card {
  background: rgba(255, 255, 255, 0.1);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 2rem;
  margin-bottom: var(--spacing-md);
  color: white;
}

.feature-card h3 {
  color: white;
  margin-bottom: var(--spacing-sm);
  font-size: 1.25rem;
}

.feature-card p {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.95rem;
  line-height: 1.5;
}

.cta-section {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
  margin-top: var(--spacing-xl);
}

.btn-primary,
.btn-secondary {
  padding: var(--spacing-sm) var(--spacing-xl);
  border-radius: var(--radius-md);
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-primary {
  background: white;
  color: var(--primary-color);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 2px solid white;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

@media (max-width: 640px) {
  h1 {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .features {
    grid-template-columns: 1fr;
  }

  .cta-section {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    text-align: center;
  }
}
</style> 