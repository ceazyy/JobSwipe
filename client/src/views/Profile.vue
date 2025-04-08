<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="max-w-3xl mx-auto">
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <div class="px-4 py-5 sm:px-6">
          <h2 class="text-lg font-medium text-gray-900">Profile Information</h2>
          <p class="mt-1 text-sm text-gray-500">
            Update your account's profile information and email address.
          </p>
        </div>
        
        <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
          <form @submit.prevent="updateProfile">
            <div class="space-y-6">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div class="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    v-model="fullName"
                    class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label for="email" class="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div class="mt-1">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    v-model="email"
                    class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label for="bio" class="block text-sm font-medium text-gray-700">
                  Bio
                </label>
                <div class="mt-1">
                  <textarea
                    id="bio"
                    name="bio"
                    rows="3"
                    v-model="bio"
                    class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  ></textarea>
                </div>
                <p class="mt-2 text-sm text-gray-500">
                  Brief description for your profile.
                </p>
              </div>

              <div>
                <label for="skills" class="block text-sm font-medium text-gray-700">
                  Skills
                </label>
                <div class="mt-1">
                  <input
                    type="text"
                    name="skills"
                    id="skills"
                    v-model="newSkill"
                    @keydown.enter.prevent="addSkill"
                    class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Type a skill and press Enter"
                  />
                </div>
                <div class="mt-2 flex flex-wrap gap-2">
                  <span
                    v-for="(skill, index) in skills"
                    :key="index"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                  >
                    {{ skill }}
                    <button
                      type="button"
                      @click="removeSkill(index)"
                      class="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none focus:bg-indigo-500 focus:text-white"
                    >
                      <span class="sr-only">Remove skill</span>
                      <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fill-rule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </button>
                  </span>
                </div>
              </div>

              <div class="flex justify-end">
                <button
                  type="submit"
                  :disabled="isLoading"
                  class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg
                    v-if="isLoading"
                    class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {{ isLoading ? 'Saving...' : 'Save' }}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useToast } from 'vue-toastification';
import { mockApi } from '../services/mockData';

const authStore = useAuthStore();
const toast = useToast();

const fullName = ref('');
const email = ref('');
const bio = ref('');
const skills = ref([]);
const newSkill = ref('');
const isLoading = ref(false);

const addSkill = () => {
  if (newSkill.value.trim() && !skills.value.includes(newSkill.value.trim())) {
    skills.value.push(newSkill.value.trim());
    newSkill.value = '';
  }
};

const removeSkill = (index) => {
  skills.value.splice(index, 1);
};

const updateProfile = async () => {
  if (isLoading.value) return;
  
  isLoading.value = true;
  
  try {
    // Use mock API instead of axios
    await mockApi.updateProfile({
      fullName: fullName.value,
      email: email.value,
      bio: bio.value,
      skills: skills.value
    });
    
    toast.success('Profile updated successfully!');
  } catch (error) {
    console.error('Error updating profile:', error);
    toast.error('Failed to update profile');
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  // Initialize form with user data
  if (authStore.currentUser) {
    fullName.value = `${authStore.currentUser.firstName} ${authStore.currentUser.lastName}`;
    email.value = authStore.currentUser.email;
    bio.value = authStore.currentUser.profile?.bio || '';
    skills.value = authStore.currentUser.profile?.skills || [];
  }
});
</script> 