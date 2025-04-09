// Mock job data
export const mockJobs = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    companyName: 'TechCorp',
    companyLogo: 'https://via.placeholder.com/150',
    location: 'San Francisco, CA',
    salary: '$120,000 - $150,000',
    employmentType: 'Full-time',
    description: 'We are looking for a Senior Frontend Developer to join our team. You will be responsible for building and maintaining our web applications using Vue.js and other modern technologies.',
    requirements: ['Vue.js', 'JavaScript', 'HTML', 'CSS', 'RESTful APIs'],
    postedAt: '2023-04-01T12:00:00Z'
  },
  {
    id: '2',
    title: 'Full Stack Developer',
    companyName: 'StartupX',
    companyLogo: 'https://via.placeholder.com/150',
    location: 'Remote',
    salary: '$90,000 - $120,000',
    employmentType: 'Full-time',
    description: 'Join our fast-growing startup as a Full Stack Developer. You will work on both frontend and backend development using modern technologies.',
    requirements: ['React', 'Node.js', 'MongoDB', 'Express', 'AWS'],
    postedAt: '2023-04-02T12:00:00Z'
  },
  {
    id: '3',
    title: 'UI/UX Designer',
    companyName: 'DesignStudio',
    companyLogo: 'https://via.placeholder.com/150',
    location: 'New York, NY',
    salary: '$80,000 - $100,000',
    employmentType: 'Full-time',
    description: 'We are seeking a talented UI/UX Designer to create beautiful and functional user interfaces for our products.',
    requirements: ['Figma', 'Adobe XD', 'UI Design', 'UX Research', 'Prototyping'],
    postedAt: '2023-04-03T12:00:00Z'
  },
  {
    id: '4',
    title: 'Backend Developer',
    companyName: 'DataSystems',
    companyLogo: 'https://via.placeholder.com/150',
    location: 'Austin, TX',
    salary: '$100,000 - $130,000',
    employmentType: 'Full-time',
    description: 'Join our backend team to build scalable and efficient systems. You will work with Node.js, Python, and various databases.',
    requirements: ['Node.js', 'Python', 'SQL', 'NoSQL', 'Microservices'],
    postedAt: '2023-04-04T12:00:00Z'
  },
  {
    id: '5',
    title: 'DevOps Engineer',
    companyName: 'CloudTech',
    companyLogo: 'https://via.placeholder.com/150',
    location: 'Seattle, WA',
    salary: '$110,000 - $140,000',
    employmentType: 'Full-time',
    description: 'We are looking for a DevOps Engineer to help us build and maintain our cloud infrastructure.',
    requirements: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
    postedAt: '2023-04-05T12:00:00Z'
  }
];

// Mock matches data
export const mockMatches = [
  {
    id: '1',
    jobId: '1',
    jobTitle: 'Senior Frontend Developer',
    companyName: 'TechCorp',
    companyLogo: 'https://via.placeholder.com/150',
    location: 'San Francisco, CA',
    matchedAt: '2023-04-06T12:00:00Z'
  },
  {
    id: '2',
    jobId: '3',
    jobTitle: 'UI/UX Designer',
    companyName: 'DesignStudio',
    companyLogo: 'https://via.placeholder.com/150',
    location: 'New York, NY',
    matchedAt: '2023-04-07T12:00:00Z'
  }
];

// Mock resume statistics
export const mockResumeStats = {
  views: 156,
  downloads: 23,
  matches: 8
};

// Mock API functions
export const mockApi = {
  // Get jobs for swiping
  getJobs: () => {
    return Promise.resolve(mockJobs);
  },
  
  // Swipe on a job
  swipeJob: (jobId, direction) => {
    console.log(`Swiped ${direction} on job ${jobId}`);
    return Promise.resolve({ success: true });
  },
  
  // Get matches
  getMatches: () => {
    return Promise.resolve(mockMatches);
  },
  
  // Update user profile
  updateProfile: (profileData) => {
    console.log('Updating profile:', profileData);
    return Promise.resolve({ success: true });
  },
  
  // Get resume statistics
  getResumeStats: () => {
    return Promise.resolve(mockResumeStats);
  },
  
  // Upload resume
  uploadResume: (file) => {
    console.log('Uploading resume:', file);
    return Promise.resolve({
      success: true,
      path: '/uploads/resume.pdf',
      uploadDate: new Date().toISOString()
    });
  },
  
  // Download resume
  downloadResume: () => {
    console.log('Downloading resume');
    return Promise.resolve({ success: true });
  },
  
  // Delete resume
  deleteResume: () => {
    console.log('Deleting resume');
    return Promise.resolve({ success: true });
  }
}; 