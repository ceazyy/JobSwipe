<template>
  <div class="matches-container">
    <div class="matches-header">
      <h1>Your Job Matches</h1>
      <p>Jobs that match your profile and preferences</p>
    </div>

    <div class="matches-filters">
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search matches..." 
          class="search-input"
        />
      </div>
      <div class="filter-options">
        <select v-model="locationFilter" class="filter-select">
          <option value="">All Locations</option>
          <option value="San Francisco">San Francisco</option>
          <option value="New York">New York</option>
          <option value="Remote">Remote</option>
          <option value="Los Angeles">Los Angeles</option>
        </select>
        <select v-model="typeFilter" class="filter-select">
          <option value="">All Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
          <option value="Freelance">Freelance</option>
        </select>
      </div>
    </div>

    <div class="matches-grid" v-if="filteredMatches.length > 0">
      <div v-for="match in filteredMatches" :key="match.id" class="match-card">
        <div class="match-header">
          <h2>{{ match.title }}</h2>
          <span class="company">{{ match.company }}</span>
        </div>
        
        <div class="match-details">
          <div class="detail-item">
            <i class="fas fa-map-marker-alt"></i>
            <span>{{ match.location }}</span>
          </div>
          <div class="detail-item">
            <i class="fas fa-dollar-sign"></i>
            <span>{{ match.salary }}</span>
          </div>
          <div class="detail-item">
            <i class="fas fa-clock"></i>
            <span>{{ match.type }}</span>
          </div>
        </div>
        
        <div class="match-description">
          <p>{{ match.description }}</p>
        </div>
        
        <div class="match-skills">
          <span v-for="skill in match.skills" :key="skill" class="skill-tag">
            {{ skill }}
          </span>
        </div>
        
        <div class="match-actions">
          <button class="btn-secondary" @click="viewDetails(match)">
            View Details
          </button>
          <button class="btn-primary" @click="applyForJob(match)">
            Apply Now
          </button>
        </div>
      </div>
    </div>
    
    <div class="no-matches" v-else>
      <i class="fas fa-search"></i>
      <h2>No matches found</h2>
      <p>Try adjusting your filters or swipe more jobs to find matches</p>
      <router-link to="/swipe" class="btn-primary">Swipe Jobs</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

// Mock matches data
const matches = ref([
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

// Filters
const searchQuery = ref('');
const locationFilter = ref('');
const typeFilter = ref('');

// Filtered matches
const filteredMatches = computed(() => {
  return matches.value.filter(match => {
    // Search query filter
    const matchesSearch = match.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         match.company.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         match.description.toLowerCase().includes(searchQuery.value.toLowerCase());
    
    // Location filter
    const matchesLocation = !locationFilter.value || match.location.includes(locationFilter.value);
    
    // Type filter
    const matchesType = !typeFilter.value || match.type === typeFilter.value;
    
    return matchesSearch && matchesLocation && matchesType;
  });
});

// Actions
const viewDetails = (match) => {
  console.log('View details for job:', match.title);
  // In a real app, this would navigate to a job details page
};

const applyForJob = (match) => {
  console.log('Applying for job:', match.title);
  // In a real app, this would open an application form or redirect to the company's application page
};
</script>

<style scoped>
.matches-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.matches-header {
  text-align: center;
  margin-bottom: 2rem;
}

.matches-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.matches-header p {
  color: var(--text-secondary);
}

.matches-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
}

.search-box {
  flex: 1;
  min-width: 300px;
  position: relative;
}

.search-box i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  font-size: 1rem;
}

.filter-options {
  display: flex;
  gap: 1rem;
}

.filter-select {
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  font-size: 1rem;
  background-color: white;
}

.matches-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.match-card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.match-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.match-header {
  margin-bottom: 1rem;
}

.match-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.company {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.match-details {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.85rem;
}

.match-description {
  margin-bottom: 1rem;
  line-height: 1.5;
  font-size: 0.9rem;
  color: var(--text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.match-skills {
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

.match-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-primary,
.btn-secondary {
  flex: 1;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
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

.no-matches {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.no-matches i {
  font-size: 3rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.no-matches h2 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.no-matches p {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

@media (max-width: 768px) {
  .matches-filters {
    flex-direction: column;
  }
  
  .filter-options {
    flex-direction: column;
  }
}
</style> 