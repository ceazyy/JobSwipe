<template>
  <div class="swipe-container">
    <div class="swipe-header">
      <h1>Swipe Jobs</h1>
      <p>Swipe right to like, left to pass</p>
    </div>

    <div class="swipe-cards" v-if="jobs.length > 0">
      <div 
        v-for="(job, index) in visibleJobs" 
        :key="job.id" 
        class="job-card"
        :class="{ 'active': index === 0 }"
      >
        <div class="job-header">
          <h2>{{ job.title }}</h2>
          <span class="company">{{ job.company }}</span>
        </div>
        
        <div class="job-details">
          <div class="detail-item">
            <i class="fas fa-map-marker-alt"></i>
            <span>{{ job.location }}</span>
          </div>
          <div class="detail-item">
            <i class="fas fa-dollar-sign"></i>
            <span>{{ job.salary }}</span>
          </div>
          <div class="detail-item">
            <i class="fas fa-clock"></i>
            <span>{{ job.type }}</span>
          </div>
        </div>
        
        <div class="job-description">
          <p>{{ job.description }}</p>
        </div>
        
        <div class="job-skills">
          <span v-for="skill in job.skills" :key="skill" class="skill-tag">
            {{ skill }}
          </span>
        </div>
        
        <div class="swipe-actions">
          <button class="swipe-btn dislike" @click="swipeLeft(job)">
            <i class="fas fa-times"></i>
          </button>
          <button class="swipe-btn like" @click="swipeRight(job)">
            <i class="fas fa-heart"></i>
          </button>
        </div>
      </div>
    </div>
    
    <div class="no-jobs" v-else>
      <i class="fas fa-search"></i>
      <h2>No more jobs to swipe</h2>
      <p>Check back later for new opportunities</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

// Mock job data
const jobs = ref([
  {
    id: 1,
    title: 'Frontend Developer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    salary: '$80,000 - $120,000',
    type: 'Full-time',
    description: 'We are looking for a Frontend Developer to join our team. You will be responsible for building the user interface of our web applications.',
    skills: ['Vue.js', 'JavaScript', 'HTML', 'CSS']
  },
  {
    id: 2,
    title: 'Backend Developer',
    company: 'DataFlow',
    location: 'Remote',
    salary: '$90,000 - $130,000',
    type: 'Full-time',
    description: 'Join our backend team to build scalable APIs and microservices. Experience with Node.js and MongoDB required.',
    skills: ['Node.js', 'MongoDB', 'Express', 'REST API']
  },
  {
    id: 3,
    title: 'Full Stack Developer',
    company: 'StartupX',
    location: 'New York, NY',
    salary: '$85,000 - $125,000',
    type: 'Full-time',
    description: 'We are seeking a Full Stack Developer to help build our next-generation web application.',
    skills: ['React', 'Node.js', 'PostgreSQL', 'AWS']
  },
  {
    id: 4,
    title: 'UI/UX Designer',
    company: 'DesignHub',
    location: 'Los Angeles, CA',
    salary: '$70,000 - $100,000',
    type: 'Full-time',
    description: 'Looking for a UI/UX Designer to create beautiful and intuitive user interfaces for our products.',
    skills: ['Figma', 'Adobe XD', 'UI Design', 'User Research']
  }
]);

// Only show the top 3 jobs at a time
const visibleJobs = computed(() => {
  return jobs.value.slice(0, 3);
});

const swipeLeft = (job) => {
  console.log('Swiped left on job:', job.title);
  // Remove the job from the list
  jobs.value = jobs.value.filter(j => j.id !== job.id);
};

const swipeRight = (job) => {
  console.log('Swiped right on job:', job.title);
  // In a real app, this would save the job as a match
  // For now, just remove it from the list
  jobs.value = jobs.value.filter(j => j.id !== job.id);
};
</script>

<style scoped>
.swipe-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.swipe-header {
  text-align: center;
  margin-bottom: 2rem;
}

.swipe-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.swipe-header p {
  color: var(--text-secondary);
}

.swipe-cards {
  position: relative;
  height: 600px;
  max-width: 500px;
  margin: 0 auto;
}

.job-card {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  transition: all 0.3s ease;
  opacity: 0;
  transform: scale(0.9);
  pointer-events: none;
}

.job-card.active {
  opacity: 1;
  transform: scale(1);
  pointer-events: auto;
  z-index: 10;
}

.job-card:nth-child(2) {
  opacity: 0.7;
  transform: scale(0.95) translateY(10px);
  z-index: 9;
}

.job-card:nth-child(3) {
  opacity: 0.4;
  transform: scale(0.9) translateY(20px);
  z-index: 8;
}

.job-header {
  margin-bottom: 1rem;
}

.job-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.company {
  color: var(--text-secondary);
  font-size: 1rem;
}

.job-details {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.job-description {
  margin-bottom: 1rem;
  line-height: 1.5;
}

.job-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.skill-tag {
  background: var(--background-light);
  color: var(--primary-color);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.swipe-actions {
  display: flex;
  justify-content: space-around;
  margin-top: 1rem;
}

.swipe-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.swipe-btn.like {
  background: var(--success-color);
  color: white;
}

.swipe-btn.dislike {
  background: var(--danger-color);
  color: white;
}

.swipe-btn:hover {
  transform: scale(1.1);
}

.no-jobs {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.no-jobs i {
  font-size: 3rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.no-jobs h2 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.no-jobs p {
  color: var(--text-secondary);
}
</style> 