<template>
  <div class="bg-white shadow rounded-lg p-6">
    <h3 class="text-lg font-medium text-gray-900 mb-4">Resume</h3>
    
    <div v-if="resume" class="mb-4">
      <div class="flex items-center justify-between p-3 bg-gray-50 rounded-md">
        <div class="flex items-center">
          <DocumentIcon class="h-6 w-6 text-gray-500 mr-3" />
          <div>
            <p class="text-sm font-medium text-gray-900">{{ getFileName(resume) }}</p>
            <p class="text-xs text-gray-500">Uploaded on {{ formatDate(resumeUploadDate) }}</p>
          </div>
        </div>
        <div class="flex space-x-2">
          <button 
            @click="downloadResume" 
            class="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <DownloadIcon class="h-4 w-4 mr-1" />
            Download
          </button>
          <button 
            @click="removeResume" 
            class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
          >
            <TrashIcon class="h-4 w-4 mr-1" />
            Remove
          </button>
        </div>
      </div>
    </div>
    
    <div v-else>
      <div 
        class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
        :class="{ 'border-indigo-500 bg-indigo-50': isDragging }"
        @dragenter.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @dragover.prevent
        @drop.prevent="handleDrop"
      >
        <div class="space-y-1 text-center">
          <UploadIcon class="mx-auto h-12 w-12 text-gray-400" />
          <div class="flex text-sm text-gray-600">
            <label
              for="resume-upload"
              class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
            >
              <span>Upload a file</span>
              <input 
                id="resume-upload" 
                type="file" 
                class="sr-only" 
                accept=".pdf,.doc,.docx"
                @change="handleFileChange"
              >
            </label>
            <p class="pl-1">or drag and drop</p>
          </div>
          <p class="text-xs text-gray-500">
            PDF, DOC, or DOCX up to 5MB
          </p>
        </div>
      </div>
    </div>
    
    <div v-if="uploadError" class="mt-2 text-sm text-red-600">
      {{ uploadError }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useToast } from 'vue-toastification';
import axios from 'axios';
import { 
  DocumentIcon, 
  DownloadIcon, 
  TrashIcon, 
  UploadIcon 
} from '@heroicons/vue/outline';

const props = defineProps({
  initialResume: {
    type: String,
    default: null
  },
  initialUploadDate: {
    type: Date,
    default: null
  }
});

const emit = defineEmits(['update:resume', 'update:uploadDate']);

const toast = useToast();
const resume = ref(props.initialResume);
const resumeUploadDate = ref(props.initialUploadDate);
const isDragging = ref(false);
const uploadError = ref('');

const getFileName = (path) => {
  if (!path) return '';
  return path.split('/').pop();
};

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    uploadResume(file);
  }
};

const handleDrop = (event) => {
  isDragging.value = false;
  const file = event.dataTransfer.files[0];
  if (file) {
    uploadResume(file);
  }
};

const uploadResume = async (file) => {
  // Validate file type
  const allowedTypes = ['.pdf', '.doc', '.docx'];
  const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
  
  if (!allowedTypes.includes(fileExtension)) {
    uploadError.value = 'Please upload a PDF, DOC, or DOCX file';
    return;
  }
  
  // Validate file size (5MB limit)
  if (file.size > 5 * 1024 * 1024) {
    uploadError.value = 'File size must be less than 5MB';
    return;
  }
  
  uploadError.value = '';
  
  try {
    const formData = new FormData();
    formData.append('resume', file);
    
    const response = await axios.post(
      'http://localhost:3000/api/users/profile/resume',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    
    resume.value = response.data.path;
    resumeUploadDate.value = new Date();
    
    emit('update:resume', resume.value);
    emit('update:uploadDate', resumeUploadDate.value);
    
    toast.success('Resume uploaded successfully');
  } catch (error) {
    uploadError.value = error.response?.data?.message || 'Failed to upload resume';
    toast.error('Failed to upload resume');
  }
};

const downloadResume = async () => {
  if (!resume.value) return;
  
  try {
    const response = await axios.get(resume.value, {
      responseType: 'blob'
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', getFileName(resume.value));
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    toast.error('Failed to download resume');
  }
};

const removeResume = async () => {
  if (!resume.value) return;
  
  try {
    await axios.delete('http://localhost:3000/api/users/profile/resume');
    
    resume.value = null;
    resumeUploadDate.value = null;
    
    emit('update:resume', null);
    emit('update:uploadDate', null);
    
    toast.success('Resume removed successfully');
  } catch (error) {
    toast.error('Failed to remove resume');
  }
};
</script> 