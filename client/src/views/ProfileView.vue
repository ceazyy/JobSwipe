<template>
  <div class="profile">
    <div class="profile-container">
      <div class="profile-header">
        <div class="avatar">
          <img :src="user?.avatar || '/default-avatar.png'" alt="Profile avatar" />
        </div>
        <h1>{{ user?.name || 'User Profile' }}</h1>
        <p class="email">{{ user?.email }}</p>
      </div>

      <div class="profile-content">
        <section class="profile-section">
          <h2>Personal Information</h2>
          <form @submit.prevent="updateProfile" class="profile-form">
            <div class="form-group">
              <label for="name">Full Name</label>
              <input
                type="text"
                id="name"
                v-model="form.name"
                placeholder="Enter your full name"
              />
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input
                type="email"
                id="email"
                v-model="form.email"
                placeholder="Enter your email"
                disabled
              />
            </div>

            <div class="form-group">
              <label for="bio">Bio</label>
              <textarea
                id="bio"
                v-model="form.bio"
                placeholder="Tell us about yourself"
                rows="4"
              ></textarea>
            </div>

            <button type="submit" class="btn-save" :disabled="loading">
              {{ loading ? 'Saving...' : 'Save Changes' }}
            </button>
          </form>
        </section>

        <section class="profile-section">
          <h2>Change Password</h2>
          <form @submit.prevent="updatePassword" class="profile-form">
            <div class="form-group">
              <label for="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                v-model="passwordForm.currentPassword"
                placeholder="Enter current password"
              />
            </div>

            <div class="form-group">
              <label for="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                v-model="passwordForm.newPassword"
                placeholder="Enter new password"
              />
            </div>

            <div class="form-group">
              <label for="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                v-model="passwordForm.confirmPassword"
                placeholder="Confirm new password"
              />
            </div>

            <button type="submit" class="btn-save" :disabled="passwordLoading">
              {{ passwordLoading ? 'Updating...' : 'Update Password' }}
            </button>
          </form>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const user = ref(null)
const loading = ref(false)
const passwordLoading = ref(false)

const form = ref({
  name: '',
  email: '',
  bio: ''
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

onMounted(async () => {
  // Load user data
  user.value = await authStore.getUserProfile()
  if (user.value) {
    form.value = {
      name: user.value.name || '',
      email: user.value.email || '',
      bio: user.value.bio || ''
    }
  }
})

const updateProfile = async () => {
  try {
    loading.value = true
    await authStore.updateProfile(form.value)
    // Show success message
  } catch (error) {
    console.error('Failed to update profile:', error)
    // Show error message
  } finally {
    loading.value = false
  }
}

const updatePassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    // Show error message about password mismatch
    return
  }

  try {
    passwordLoading.value = true
    await authStore.updatePassword({
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword
    })
    // Show success message
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  } catch (error) {
    console.error('Failed to update password:', error)
    // Show error message
  } finally {
    passwordLoading.value = false
  }
}
</script>

<style scoped>
.profile {
  min-height: 100vh;
  background: var(--background-color);
  padding: var(--spacing-xl);
}

.profile-container {
  max-width: 800px;
  margin: 0 auto;
  background: var(--surface-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}

.profile-header {
  text-align: center;
  padding: var(--spacing-xl);
  background: var(--primary-color);
  color: white;
  position: relative;
}

.profile-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(to right, var(--primary-color), var(--primary-hover));
}

.avatar {
  width: 120px;
  height: 120px;
  margin: 0 auto var(--spacing-md);
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid rgba(255, 255, 255, 0.2);
  box-shadow: var(--shadow-md);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-header h1 {
  margin: 0;
  font-size: 1.8rem;
  color: white;
}

.email {
  margin: var(--spacing-sm) 0 0;
  opacity: 0.9;
  color: rgba(255, 255, 255, 0.9);
}

.profile-content {
  padding: var(--spacing-xl);
}

.profile-section {
  margin-bottom: var(--spacing-xl);
  background: var(--surface-color);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
}

.profile-section:last-child {
  margin-bottom: 0;
}

.profile-section h2 {
  color: var(--text-primary);
  margin-bottom: var(--spacing-lg);
  font-size: 1.4rem;
  position: relative;
  padding-bottom: var(--spacing-sm);
}

.profile-section h2::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 2px;
  background: var(--primary-color);
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

label {
  color: var(--text-primary);
  font-weight: 500;
  font-size: 0.9rem;
}

input,
textarea {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--input-background);
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.2s ease;
}

input:disabled {
  background: var(--background-color);
  cursor: not-allowed;
  opacity: 0.7;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
}

textarea {
  resize: vertical;
  min-height: 100px;
}

.btn-save {
  background: var(--primary-color);
  color: white;
  padding: var(--spacing-sm) var(--spacing-lg);
  border: none;
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
}

.btn-save:hover {
  background: var(--primary-hover);
  transform: translateY(-1px);
}

.btn-save:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

@media (max-width: 640px) {
  .profile {
    padding: var(--spacing-md);
  }

  .profile-content {
    padding: var(--spacing-md);
  }

  .profile-section {
    padding: var(--spacing-md);
  }
}
</style> 