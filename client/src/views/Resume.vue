<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="max-w-3xl mx-auto">
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <div class="px-4 py-5 sm:px-6">
          <h2 class="text-lg font-medium text-gray-900">Resume Management</h2>
          <p class="mt-1 text-sm text-gray-500">
            Upload and manage your resume for job applications.
          </p>
        </div>
        
        <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
          <ResumeUpload 
            :initial-resume="userResume"
            :initial-upload-date="resumeUploadDate"
            @update:resume="updateResume"
            @update:upload-date="updateResumeUploadDate"
          />
        </div>
        
        <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Resume Tips</h3>
          <ul class="list-disc pl-5 space-y-2 text-sm text-gray-600">
            <li>Keep your resume concise and focused on relevant experience</li>
            <li>Use action verbs to describe your achievements</li>
            <li>Include quantifiable results where possible</li>
            <li>Tailor your resume to the job you're applying for</li>
            <li>Proofread carefully for errors</li>
            <li>Use a clean, professional format</li>
          </ul>
        </div>
        
        <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">AI Resume Enhancement</h3>
          <p class="text-sm text-gray-600 mb-4">
            Our AI can analyze your resume and suggest improvements to make it more effective.
          </p>
          <button 
            @click="enhanceResume" 
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            :disabled="!userResume || isEnhancing"
          >
            <SparklesIcon v-if="!isEnhancing" class="h-5 w-5 mr-2" />
            <svg v-else class="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isEnhancing ? 'Enhancing...' : 'Enhance Resume with AI' }}
          </button>
          
          <div v-if="enhancementResults" class="mt-4 p-4 bg-indigo-50 rounded-md">
            <h4 class="text-sm font-medium text-indigo-800 mb-2">Enhancement Suggestions</h4>
            <ul class="list-disc pl-5 space-y-1 text-sm text-indigo-700">
              <li v-for="(suggestion, index) in enhancementResults" :key="index">
                {{ suggestion }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '../stores/auth';
import axios from 'axios';
import { SparklesIcon } from '@heroicons/vue/outline';
import ResumeUpload from '../components/ResumeUpload.vue';

const toast = useToast();
const authStore = useAuthStore();
const userResume = ref(null);
const resumeUploadDate = ref(null);
const isEnhancing = ref(false);
const enhancementResults = ref(null);

const updateResume = (newResume) => {
  userResume.value = newResume;
};

const updateResumeUploadDate = (newDate) => {
  resumeUploadDate.value = newDate;
};

const enhanceResume = async () => {
  if (!userResume.value) return;
  
  isEnhancing.value = true;
  enhancementResults.value = null;
  
  try {
    const response = await axios.post('http://localhost:3000/api/users/profile/resume/enhance');
    enhancementResults.value = response.data.suggestions;
    toast.success('Resume enhancement completed');
  } catch (error) {
    toast.error('Failed to enhance resume');
  } finally {
    isEnhancing.value = false;
  }
};

const fetchUserResume = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/users/profile/resume');
    if (response.data.resume) {
      userResume.value = response.data.resume;
      resumeUploadDate.value = response.data.uploadDate;
    }
  } catch (error) {
    // If 404, it means no resume exists yet
    if (error.response?.status !== 404) {
      toast.error('Failed to fetch resume information');
    }
  }
};

onMounted(() => {
  fetchUserResume();
});
</script> 