<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="max-w-3xl mx-auto">
      <!-- Job Card -->
      <div v-if="currentJob" class="bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="p-6">
          <!-- Company Info -->
          <div class="flex items-center mb-4">
            <img
              v-if="currentJob.company.logo"
              :src="currentJob.company.logo"
              :alt="currentJob.company.name"
              class="h-12 w-12 rounded-full"
            />
            <div class="ml-4">
              <h2 class="text-xl font-semibold text-gray-900">
                {{ currentJob.title }}
              </h2>
              <p class="text-gray-600">{{ currentJob.company.name }}</p>
            </div>
          </div>

          <!-- Job Details -->
          <div class="space-y-4">
            <div class="flex items-center text-gray-600">
              <LocationMarkerIcon class="h-5 w-5 mr-2" />
              <span>{{ formatLocation(currentJob.location) }}</span>
            </div>

            <div class="flex items-center text-gray-600">
              <CurrencyDollarIcon class="h-5 w-5 mr-2" />
              <span>{{ formatSalary(currentJob.salary) }}</span>
            </div>

            <div class="flex items-center text-gray-600">
              <BriefcaseIcon class="h-5 w-5 mr-2" />
              <span>{{ currentJob.employmentType }}</span>
            </div>

            <!-- Description -->
            <div class="mt-4">
              <h3 class="text-lg font-medium text-gray-900 mb-2">Description</h3>
              <p class="text-gray-600">{{ currentJob.description }}</p>
            </div>

            <!-- Requirements -->
            <div class="mt-4">
              <h3 class="text-lg font-medium text-gray-900 mb-2">Requirements</h3>
              <ul class="list-disc list-inside text-gray-600">
                <li v-for="skill in currentJob.requirements.skills" :key="skill">
                  {{ skill }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Swipe Actions -->
          <div class="mt-8 flex justify-center space-x-4">
            <button
              @click="swipe('left')"
              class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              <XIcon class="h-6 w-6 mr-2" />
              Skip
            </button>
            <button
              @click="swipe('right')"
              class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              <CheckIcon class="h-6 w-6 mr-2" />
              Apply
            </button>
          </div>
        </div>
      </div>

      <!-- No More Jobs -->
      <div v-else class="text-center py-12">
        <h3 class="text-lg font-medium text-gray-900">No more jobs to show</h3>
        <p class="mt-2 text-gray-600">
          Check back later for new opportunities or update your preferences to see more jobs.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { mockApi } from '../services/mockData';
import {
  LocationMarkerIcon,
  CurrencyDollarIcon,
  BriefcaseIcon,
  XIcon,
  CheckIcon
} from '@heroicons/vue/outline';

const toast = useToast();
const currentJob = ref(null);
const jobs = ref([]);
const isLoading = ref(true);

const formatLocation = (location) => {
  return location || 'Remote';
};

const formatSalary = (salary) => {
  return salary || 'Not specified';
};

const fetchJobs = async () => {
  isLoading.value = true;
  
  try {
    // Use mock API instead of axios
    const data = await mockApi.getJobs();
    jobs.value = data;
    
    if (data.length > 0) {
      currentJob.value = data[0];
    }
  } catch (error) {
    console.error('Error fetching jobs:', error);
    toast.error('Failed to fetch jobs');
  } finally {
    isLoading.value = false;
  }
};

const swipe = async (direction) => {
  if (!currentJob.value) return;
  
  try {
    // Use mock API instead of axios
    await mockApi.swipeJob(currentJob.value.id, direction);
    
    // Remove the current job from the list
    jobs.value = jobs.value.filter(job => job.id !== currentJob.value.id);
    
    // Set the next job as current
    if (jobs.value.length > 0) {
      currentJob.value = jobs.value[0];
    } else {
      currentJob.value = null;
    }
    
    // Show toast based on direction
    if (direction === 'right') {
      toast.success('Applied to job!');
    } else {
      toast.info('Skipped job');
    }
  } catch (error) {
    console.error('Error swiping job:', error);
    toast.error('Failed to process swipe');
  }
};

onMounted(() => {
  fetchJobs();
});
</script> 