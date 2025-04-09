<template>
  <div class="register">
    <div class="register-container">
      <h1>Create Account</h1>
      <p class="subtitle">Join JobMatch to find your perfect job</p>

      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label for="name">Full Name</label>
          <input
            type="text"
            id="name"
            v-model="form.name"
            required
            placeholder="Enter your full name"
          />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="form.email"
            required
            placeholder="Enter your email"
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            v-model="form.password"
            required
            placeholder="Create a password"
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="form.confirmPassword"
            required
            placeholder="Confirm your password"
          />
        </div>

        <div class="form-options">
          <label class="terms">
            <input type="checkbox" v-model="form.acceptTerms" required />
            <span>I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></span>
          </label>
        </div>

        <button type="submit" class="btn-register" :disabled="loading">
          {{ loading ? 'Creating Account...' : 'Create Account' }}
        </button>

        <p class="login-link">
          Already have an account?
          <router-link to="/login">Sign in</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)

const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
})

const handleRegister = async () => {
  if (form.value.password !== form.value.confirmPassword) {
    // Show error message about password mismatch
    return
  }

  try {
    loading.value = true
    await authStore.register({
      name: form.value.name,
      email: form.value.email,
      password: form.value.password
    })
    router.push('/profile')
  } catch (error) {
    console.error('Registration failed:', error)
    // Show error message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--background-color);
  padding: 1rem;
}

.register-container {
  background: var(--surface-color);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h1 {
  text-align: center;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.subtitle {
  text-align: center;
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  color: var(--text-primary);
  font-weight: 500;
}

input[type="text"],
input[type="email"],
input[type="password"] {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--input-background);
  color: var(--text-primary);
}

input[type="text"]:focus,
input[type="email"]:focus,
input[type="password"]:focus {
  outline: none;
  border-color: var(--primary-color);
}

.form-options {
  display: flex;
  align-items: center;
}

.terms {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.terms a {
  color: var(--primary-color);
  text-decoration: none;
}

.terms a:hover {
  text-decoration: underline;
}

.btn-register {
  background: var(--primary-color);
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.btn-register:hover {
  opacity: 0.9;
}

.btn-register:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.login-link {
  text-align: center;
  color: var(--text-secondary);
}

.login-link a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
}

.login-link a:hover {
  text-decoration: underline;
}
</style> 