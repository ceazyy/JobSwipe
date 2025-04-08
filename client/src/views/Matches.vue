<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="max-w-3xl mx-auto">
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <div class="px-4 py-5 sm:px-6">
          <h2 class="text-lg font-medium text-gray-900">Your Matches</h2>
          <p class="mt-1 text-sm text-gray-500">
            Companies that have shown interest in your profile.
          </p>
        </div>
        
        <div class="border-t border-gray-200">
          <div v-if="isLoading" class="p-4 text-center">
            <svg class="animate-spin h-8 w-8 mx-auto text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="mt-2 text-sm text-gray-500">Loading matches...</p>
          </div>
          
          <div v-else-if="matches.length === 0" class="p-4 text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No matches yet</h3>
            <p class="mt-1 text-sm text-gray-500">Start swiping on jobs to get matches!</p>
            <div class="mt-6">
              <router-link
                to="/swipe"
                class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Start Swiping
              </router-link>
            </div>
          </div>
          
          <ul v-else class="divide-y divide-gray-200">
            <li v-for="match in matches" :key="match.id" class="p-4 hover:bg-gray-50">
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0">
                  <img
                    v-if="match.companyLogo"
                    :src="match.companyLogo"
                    :alt="match.companyName"
                    class="h-12 w-12 rounded-full"
                  />
                  <div
                    v-else
                    class="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center"
                  >
                    <span class="text-indigo-600 font-medium text-lg">
                      {{ match.companyName.charAt(0) }}
                    </span>
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">
                    {{ match.jobTitle }}
                  </p>
                  <p class="text-sm text-gray-500 truncate">
                    {{ match.companyName }}
                  </p>
                </div>
                <div>
                  <button
                    @click="startChat(match)"
                    class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Chat
                  </button>
                </div>
              </div>
              <div class="mt-2">
                <div class="flex items-center text-sm text-gray-500">
                  <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {{ match.location }}
                </div>
                <div class="mt-1 flex items-center text-sm text-gray-500">
                  <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Matched {{ formatDate(match.matchedAt) }}
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { mockApi } from '../services/mockData';

const toast = useToast();
const matches = ref([]);
const isLoading = ref(true);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const startChat = (match) => {
  // This would open a chat interface with the company
  toast.info('Chat feature coming soon!');
};

const fetchMatches = async () => {
  isLoading.value = true;
  
  try {
    // Use mock API instead of axios
    const data = await mockApi.getMatches();
    matches.value = data;
  } catch (error) {
    console.error('Error fetching matches:', error);
    toast.error('Failed to fetch matches');
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchMatches();
});
</script> 