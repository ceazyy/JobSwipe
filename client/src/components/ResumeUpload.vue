<template>
  <div class="space-y-6">
    <!-- Current Resume Section -->
    <div v-if="resume" class="bg-gray-50 p-4 rounded-lg">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <DocumentIcon class="h-8 w-8 text-gray-400" />
          <div>
            <h4 class="text-sm font-medium text-gray-900">Current Resume</h4>
            <p class="text-sm text-gray-500">Uploaded on {{ formatDate(uploadDate) }}</p>
          </div>
        </div>
        <div class="flex space-x-2">
          <button
            @click="downloadResume"
            class="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <DownloadIcon class="h-4 w-4 mr-1" />
            Download
          </button>
          <button
            @click="removeResume"
            class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <TrashIcon class="h-4 w-4 mr-1" />
            Remove
          </button>
        </div>
      </div>
    </div>

    <!-- Upload Section -->
    <div
      class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg"
      :class="{ 'border-indigo-500': isDragging }"
      @dragenter.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @dragover.prevent
      @drop.prevent="handleDrop"
    >
      <div class="space-y-1 text-center">
        <svg
          class="mx-auto h-12 w-12 text-gray-400"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <path
            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <div class="flex text-sm text-gray-600">
          <label
            for="file-upload"
            class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
          >
            <span>Upload a file</span>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              class="sr-only"
              accept=".pdf,.doc,.docx"
              @change="handleFileSelect"
            />
          </label>
          <p class="pl-1">or drag and drop</p>
        </div>
        <p class="text-xs text-gray-500">PDF, DOC, or DOCX up to 10MB</p>
      </div>
    </div>

    <!-- Resume Builder Section -->
    <div class="mt-8">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Resume Builder</h3>
      <div class="bg-white shadow rounded-lg p-6">
        <form @submit.prevent="saveResume" class="space-y-6">
          <!-- Personal Information -->
          <div>
            <h4 class="text-sm font-medium text-gray-900 mb-4">Personal Information</h4>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  v-model="resumeData.firstName"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  v-model="resumeData.lastName"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          <!-- Contact Information -->
          <div>
            <h4 class="text-sm font-medium text-gray-900 mb-4">Contact Information</h4>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  v-model="resumeData.email"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  v-model="resumeData.phone"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          <!-- Skills -->
          <div>
            <h4 class="text-sm font-medium text-gray-900 mb-4">Skills</h4>
            <div class="flex flex-wrap gap-2">
              <div
                v-for="(skill, index) in resumeData.skills"
                :key="index"
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700"
              >
                {{ skill }}
                <button
                  type="button"
                  @click="removeSkill(index)"
                  class="ml-2 text-indigo-500 hover:text-indigo-700"
                >
                  <XIcon class="h-4 w-4" />
                </button>
              </div>
              <div class="flex-1 min-w-[200px]">
                <input
                  type="text"
                  v-model="newSkill"
                  @keydown.enter.prevent="addSkill"
                  placeholder="Add a skill"
                  class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          <!-- Save Button -->
          <div class="flex justify-end">
            <button
              type="submit"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Resume
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import {
  DocumentIcon,
  DownloadIcon,
  TrashIcon,
  XIcon
} from '@heroicons/vue/outline';

const props = defineProps({
  initialResume: {
    type: Object,
    default: null
  },
  initialUploadDate: {
    type: String,
    default: null
  }
});

const emit = defineEmits(['update:resume', 'update:upload-date']);

const toast = useToast();
const isDragging = ref(false);
const resume = ref(props.initialResume);
const uploadDate = ref(props.initialUploadDate);
const newSkill = ref('');

const resumeData = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  skills: []
});

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    uploadFile(file);
  }
};

const handleDrop = (event) => {
  isDragging.value = false;
  const file = event.dataTransfer.files[0];
  if (file) {
    uploadFile(file);
  }
};

const uploadFile = async (file) => {
  if (!file.type.match('application/pdf|application/msword|application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
    toast.error('Please upload a PDF or Word document');
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    toast.error('File size must be less than 10MB');
    return;
  }

  try {
    // Mock file upload
    resume.value = {
      name: file.name,
      type: file.type,
      size: file.size
    };
    uploadDate.value = new Date().toISOString();
    
    emit('update:resume', resume.value);
    emit('update:upload-date', uploadDate.value);
    
    toast.success('Resume uploaded successfully');
  } catch (error) {
    console.error('Error uploading resume:', error);
    toast.error('Failed to upload resume');
  }
};

const downloadResume = () => {
  if (!resume.value) return;
  
  // Mock download
  toast.success('Resume download started');
};

const removeResume = () => {
  resume.value = null;
  uploadDate.value = null;
  emit('update:resume', null);
  emit('update:upload-date', null);
  toast.success('Resume removed');
};

const addSkill = () => {
  if (!newSkill.value.trim()) return;
  
  if (!resumeData.value.skills.includes(newSkill.value.trim())) {
    resumeData.value.skills.push(newSkill.value.trim());
  }
  
  newSkill.value = '';
};

const removeSkill = (index) => {
  resumeData.value.skills.splice(index, 1);
};

const saveResume = async () => {
  try {
    // Mock save
    toast.success('Resume saved successfully');
  } catch (error) {
    console.error('Error saving resume:', error);
    toast.error('Failed to save resume');
  }
};

onMounted(() => {
  if (props.initialResume) {
    resume.value = props.initialResume;
    uploadDate.value = props.initialUploadDate;
  }
});
</script> 