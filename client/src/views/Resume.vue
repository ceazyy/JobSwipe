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
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div class="bg-gray-50 p-4 rounded-lg">
              <h4 class="text-sm font-medium text-gray-900 mb-2">Format & Structure</h4>
              <ul class="list-disc pl-5 space-y-1 text-sm text-gray-600">
                <li>Keep your resume concise and focused</li>
                <li>Use clear section headings</li>
                <li>Include quantifiable achievements</li>
                <li>Use action verbs to describe experience</li>
              </ul>
            </div>
            
            <div class="bg-gray-50 p-4 rounded-lg">
              <h4 class="text-sm font-medium text-gray-900 mb-2">Content Tips</h4>
              <ul class="list-disc pl-5 space-y-1 text-sm text-gray-600">
                <li>Tailor your resume to each job</li>
                <li>Highlight relevant skills and experience</li>
                <li>Include keywords from job descriptions</li>
                <li>Proofread for errors</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Resume Analytics</h3>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div class="bg-indigo-50 p-4 rounded-lg">
              <p class="text-sm font-medium text-indigo-900">Views</p>
              <p class="mt-1 text-2xl font-semibold text-indigo-600">{{ resumeStats.views }}</p>
            </div>
            
            <div class="bg-green-50 p-4 rounded-lg">
              <p class="text-sm font-medium text-green-900">Downloads</p>
              <p class="mt-1 text-2xl font-semibold text-green-600">{{ resumeStats.downloads }}</p>
            </div>
            
            <div class="bg-purple-50 p-4 rounded-lg">
              <p class="text-sm font-medium text-purple-900">Matches</p>
              <p class="mt-1 text-2xl font-semibold text-purple-600">{{ resumeStats.matches }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import ResumeUpload from '../components/ResumeUpload.vue';
import { mockApi } from '../services/mockData';

const toast = useToast();
const userResume = ref(null);
const resumeUploadDate = ref(null);
const resumeStats = ref({
  views: 0,
  downloads: 0,
  matches: 0
});

const updateResume = (resume) => {
  userResume.value = resume;
};

const updateResumeUploadDate = (date) => {
  resumeUploadDate.value = date;
};

const fetchResumeStats = async () => {
  try {
    // Mock API call
    const stats = await mockApi.getResumeStats();
    resumeStats.value = stats;
  } catch (error) {
    console.error('Error fetching resume stats:', error);
    toast.error('Failed to fetch resume statistics');
  }
};

onMounted(() => {
  fetchResumeStats();
});
</script> 