<template>
  <div class="settings-container">
    <div class="settings-header">
      <h1>Account Settings</h1>
      <p>Manage your account preferences and notifications</p>
    </div>

    <div class="settings-content">
      <div class="settings-sidebar">
        <div 
          v-for="(section, index) in settingsSections" 
          :key="index"
          class="sidebar-item"
          :class="{ active: activeSection === index }"
          @click="activeSection = index"
        >
          <i :class="section.icon"></i>
          <span>{{ section.title }}</span>
        </div>
      </div>

      <div class="settings-main">
        <!-- Profile Settings -->
        <div v-if="activeSection === 0" class="settings-section">
          <h2>Profile Settings</h2>
          <form @submit.prevent="updateProfile" class="settings-form">
            <div class="form-group">
              <label for="firstName">First Name</label>
              <input 
                type="text" 
                id="firstName" 
                v-model="profileForm.firstName" 
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label for="lastName">Last Name</label>
              <input 
                type="text" 
                id="lastName" 
                v-model="profileForm.lastName" 
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input 
                type="email" 
                id="email" 
                v-model="profileForm.email" 
                class="form-input"
                disabled
              />
              <small class="form-help">Email cannot be changed</small>
            </div>
            <div class="form-group">
              <label for="bio">Bio</label>
              <textarea 
                id="bio" 
                v-model="profileForm.bio" 
                class="form-input"
                rows="4"
              ></textarea>
            </div>
            <div class="form-group">
              <label for="avatar">Profile Picture</label>
              <div class="avatar-upload">
                <img 
                  :src="profileForm.avatar || '/src/assets/default-avatar.svg'" 
                  alt="Profile" 
                  class="avatar-preview"
                />
                <button type="button" class="btn-secondary">Change</button>
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn-primary">Save Changes</button>
            </div>
          </form>
        </div>

        <!-- Job Preferences -->
        <div v-if="activeSection === 1" class="settings-section">
          <h2>Job Preferences</h2>
          <form @submit.prevent="updatePreferences" class="settings-form">
            <div class="form-group">
              <label>Job Types</label>
              <div class="checkbox-group">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="preferencesForm.jobTypes" value="Full-time" />
                  <span>Full-time</span>
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" v-model="preferencesForm.jobTypes" value="Part-time" />
                  <span>Part-time</span>
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" v-model="preferencesForm.jobTypes" value="Contract" />
                  <span>Contract</span>
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" v-model="preferencesForm.jobTypes" value="Freelance" />
                  <span>Freelance</span>
                </label>
              </div>
            </div>
            <div class="form-group">
              <label>Locations</label>
              <div class="checkbox-group">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="preferencesForm.locations" value="San Francisco" />
                  <span>San Francisco</span>
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" v-model="preferencesForm.locations" value="New York" />
                  <span>New York</span>
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" v-model="preferencesForm.locations" value="Los Angeles" />
                  <span>Los Angeles</span>
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" v-model="preferencesForm.locations" value="Remote" />
                  <span>Remote</span>
                </label>
              </div>
            </div>
            <div class="form-group">
              <label for="salary">Salary Range</label>
              <select id="salary" v-model="preferencesForm.salary" class="form-input">
                <option value="">Any</option>
                <option value="0-50000">$0 - $50,000</option>
                <option value="50000-100000">$50,000 - $100,000</option>
                <option value="100000-150000">$100,000 - $150,000</option>
                <option value="150000+">$150,000+</option>
              </select>
            </div>
            <div class="form-group">
              <label>Skills</label>
              <div class="skills-input">
                <div class="skill-tags">
                  <span 
                    v-for="skill in preferencesForm.skills" 
                    :key="skill" 
                    class="skill-tag"
                  >
                    {{ skill }}
                    <button 
                      type="button" 
                      class="remove-skill" 
                      @click="removeSkill(skill)"
                    >
                      &times;
                    </button>
                  </span>
                </div>
                <div class="skill-input-container">
                  <input 
                    type="text" 
                    v-model="newSkill" 
                    @keydown.enter.prevent="addSkill"
                    placeholder="Add a skill and press Enter"
                    class="form-input"
                  />
                  <button 
                    type="button" 
                    class="btn-secondary" 
                    @click="addSkill"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn-primary">Save Preferences</button>
            </div>
          </form>
        </div>

        <!-- Notifications -->
        <div v-if="activeSection === 2" class="settings-section">
          <h2>Notification Settings</h2>
          <form @submit.prevent="updateNotifications" class="settings-form">
            <div class="form-group">
              <label class="toggle-label">
                <span>Email Notifications</span>
                <div class="toggle-switch">
                  <input 
                    type="checkbox" 
                    v-model="notificationsForm.email" 
                    id="email-toggle"
                  />
                  <span class="toggle-slider"></span>
                </div>
              </label>
              <small class="form-help">Receive notifications about new job matches via email</small>
            </div>
            <div class="form-group">
              <label class="toggle-label">
                <span>Push Notifications</span>
                <div class="toggle-switch">
                  <input 
                    type="checkbox" 
                    v-model="notificationsForm.push" 
                    id="push-toggle"
                  />
                  <span class="toggle-slider"></span>
                </div>
              </label>
              <small class="form-help">Receive push notifications on your device</small>
            </div>
            <div class="form-group">
              <label class="toggle-label">
                <span>Weekly Digest</span>
                <div class="toggle-switch">
                  <input 
                    type="checkbox" 
                    v-model="notificationsForm.weeklyDigest" 
                    id="digest-toggle"
                  />
                  <span class="toggle-slider"></span>
                </div>
              </label>
              <small class="form-help">Receive a weekly summary of new job matches</small>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn-primary">Save Notification Settings</button>
            </div>
          </form>
        </div>

        <!-- Security -->
        <div v-if="activeSection === 3" class="settings-section">
          <h2>Security Settings</h2>
          <form @submit.prevent="updatePassword" class="settings-form">
            <div class="form-group">
              <label for="currentPassword">Current Password</label>
              <input 
                type="password" 
                id="currentPassword" 
                v-model="securityForm.currentPassword" 
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label for="newPassword">New Password</label>
              <input 
                type="password" 
                id="newPassword" 
                v-model="securityForm.newPassword" 
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label for="confirmPassword">Confirm New Password</label>
              <input 
                type="password" 
                id="confirmPassword" 
                v-model="securityForm.confirmPassword" 
                class="form-input"
              />
            </div>
            <div class="form-actions">
              <button type="submit" class="btn-primary">Update Password</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const activeSection = ref(0);

// Settings sections
const settingsSections = [
  { title: 'Profile', icon: 'fas fa-user' },
  { title: 'Job Preferences', icon: 'fas fa-briefcase' },
  { title: 'Notifications', icon: 'fas fa-bell' },
  { title: 'Security', icon: 'fas fa-shield-alt' }
];

// Profile form
const profileForm = reactive({
  firstName: authStore.user?.firstName || '',
  lastName: authStore.user?.lastName || '',
  email: authStore.user?.email || '',
  bio: 'Frontend developer with a passion for creating beautiful user interfaces.',
  avatar: authStore.user?.avatar || null
});

// Job preferences form
const preferencesForm = reactive({
  jobTypes: ['Full-time', 'Contract'],
  locations: ['San Francisco', 'Remote'],
  salary: '100000-150000',
  skills: ['Vue.js', 'JavaScript', 'HTML', 'CSS', 'Node.js']
});

// New skill input
const newSkill = ref('');

// Notifications form
const notificationsForm = reactive({
  email: true,
  push: true,
  weeklyDigest: false
});

// Security form
const securityForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

// Form submission handlers
const updateProfile = async () => {
  try {
    await authStore.updateProfile(profileForm);
    alert('Profile updated successfully!');
  } catch (error) {
    console.error('Failed to update profile:', error);
    alert('Failed to update profile. Please try again.');
  }
};

const updatePreferences = () => {
  console.log('Updating preferences:', preferencesForm);
  alert('Preferences updated successfully!');
};

const updateNotifications = () => {
  console.log('Updating notifications:', notificationsForm);
  alert('Notification settings updated successfully!');
};

const updatePassword = () => {
  if (securityForm.newPassword !== securityForm.confirmPassword) {
    alert('New passwords do not match!');
    return;
  }
  
  console.log('Updating password');
  alert('Password updated successfully!');
  
  // Reset form
  securityForm.currentPassword = '';
  securityForm.newPassword = '';
  securityForm.confirmPassword = '';
};

// Skill management
const addSkill = () => {
  if (newSkill.value.trim() && !preferencesForm.skills.includes(newSkill.value.trim())) {
    preferencesForm.skills.push(newSkill.value.trim());
    newSkill.value = '';
  }
};

const removeSkill = (skill) => {
  preferencesForm.skills = preferencesForm.skills.filter(s => s !== skill);
};
</script>

<style scoped>
.settings-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.settings-header {
  text-align: center;
  margin-bottom: 2rem;
}

.settings-header h1 {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.settings-header p {
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.settings-content {
  display: flex;
  gap: 1.5rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.settings-sidebar {
  width: 220px;
  background: var(--background-light);
  padding: 1.25rem 0;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.95rem;
}

.sidebar-item:hover {
  background: rgba(0, 0, 0, 0.03);
}

.sidebar-item.active {
  background: var(--primary-color);
  color: white;
}

.sidebar-item i {
  width: 18px;
  text-align: center;
}

.settings-main {
  flex: 1;
  padding: 1.5rem;
}

.settings-section h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.25rem;
  color: var(--text-primary);
}

.settings-form {
  max-width: 550px;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.4rem;
  font-weight: 500;
  color: var(--text-primary);
  font-size: 0.95rem;
}

.form-input {
  width: 100%;
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 0.4rem;
  font-size: 0.95rem;
  background-color: #f9fafb;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(var(--primary-rgb), 0.15);
}

.form-help {
  display: block;
  margin-top: 0.4rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.avatar-upload {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.avatar-preview {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--border-color);
}

.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  font-size: 0.9rem;
}

.skills-input {
  margin-top: 0.4rem;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 0.4rem;
}

.skill-tag {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: var(--background-light);
  color: var(--primary-color);
  padding: 0.2rem 0.6rem;
  border-radius: 16px;
  font-size: 0.85rem;
}

.remove-skill {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 1.1rem;
  line-height: 1;
  padding: 0;
}

.skill-input-container {
  display: flex;
  gap: 0.4rem;
}

.toggle-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  font-size: 0.95rem;
}

.toggle-switch {
  position: relative;
  width: 44px;
  height: 22px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--border-color);
  transition: .3s;
  border-radius: 22px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .3s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: var(--primary-color);
}

input:checked + .toggle-slider:before {
  transform: translateX(22px);
}

.form-actions {
  margin-top: 1.5rem;
}

.btn-primary,
.btn-secondary {
  padding: 0.6rem 1.25rem;
  border-radius: 0.4rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.95rem;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
  border: none;
}

.btn-primary:hover {
  background: var(--primary-hover);
}

.btn-secondary {
  background: transparent;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
}

.btn-secondary:hover {
  background: var(--background-light);
}

@media (max-width: 768px) {
  .settings-content {
    flex-direction: column;
  }
  
  .settings-sidebar {
    width: 100%;
    padding: 0;
  }
  
  .sidebar-item {
    padding: 0.75rem 1rem;
  }
}
</style> 