<template>
  <div class="login">
    <div class="login-container">
      <h1>Welcome Back</h1>
      <p class="subtitle">Please sign in to your account</p>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            required
            placeholder="Enter your email"
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            required
            placeholder="Enter your password"
          />
        </div>

        <div class="form-options">
          <label class="remember-me">
            <input type="checkbox" v-model="rememberMe" />
            <span>Remember me</span>
          </label>
          <a href="#" class="forgot-password">Forgot password?</a>
        </div>

        <button type="submit" class="btn-login" :disabled="loading">
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>

        <p class="register-link">
          Don't have an account?
          <router-link to="/register">Sign up</router-link>
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

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const loading = ref(false)

const handleLogin = async () => {
  try {
    loading.value = true
    await authStore.login({
      email: email.value,
      password: password.value
    })
    router.push('/profile')
  } catch (error) {
    console.error('Login failed:', error)
    // Here you would typically show an error message to the user
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--background-color);
  padding: 1rem;
}

.login-container {
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

.login-form {
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

input[type="email"],
input[type="password"] {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--input-background);
  color: var(--text-primary);
}

input[type="email"]:focus,
input[type="password"]:focus {
  outline: none;
  border-color: var(--primary-color);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.forgot-password {
  color: var(--primary-color);
  text-decoration: none;
}

.forgot-password:hover {
  text-decoration: underline;
}

.btn-login {
  background: var(--primary-color);
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.btn-login:hover {
  opacity: 0.9;
}

.btn-login:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.register-link {
  text-align: center;
  color: var(--text-secondary);
}

.register-link a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
}

.register-link a:hover {
  text-decoration: underline;
}
</style> 