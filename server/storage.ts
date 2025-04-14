import {
  User, InsertUser, Job, InsertJob, Swipe, InsertSwipe,
  RecruiterInterest, InsertRecruiterInterest, Match, InsertMatch,
  WorkExperience, InsertWorkExperience, Education, InsertEducation,
  Skill, InsertSkill
} from "@shared/schema";

export interface JobFilters {
  source?: string;
  jobType?: string;
  location?: string;
  remote?: boolean;
  search?: string;
}

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;
  
  // Jobs
  getJob(id: number): Promise<Job | undefined>;
  getJobs(filters?: JobFilters): Promise<Job[]>;
  createJob(job: InsertJob): Promise<Job>;
  
  // Swipes
  createSwipe(swipe: InsertSwipe): Promise<Swipe>;
  getUserSwipes(userId: number): Promise<Swipe[]>;
  getSwipe(userId: number, jobId: number): Promise<Swipe | undefined>;
  
  // Recruiter Interests
  createRecruiterInterest(interest: InsertRecruiterInterest): Promise<RecruiterInterest>;
  getRecruiterInterests(jobId: number): Promise<RecruiterInterest[]>;
  
  // Matches
  createMatch(match: InsertMatch): Promise<Match>;
  getUserMatches(userId: number): Promise<Match[]>;
  getMatchesByStatus(userId: number, status: string): Promise<Match[]>;
  updateMatchStatus(id: number, status: string): Promise<Match | undefined>;
  getMatch(userId: number, jobId: number): Promise<Match | undefined>;
  
  // Work Experience
  createWorkExperience(experience: InsertWorkExperience): Promise<WorkExperience>;
  getUserWorkExperiences(userId: number): Promise<WorkExperience[]>;
  updateWorkExperience(id: number, data: Partial<WorkExperience>): Promise<WorkExperience | undefined>;
  deleteWorkExperience(id: number): Promise<boolean>;
  
  // Education
  createEducation(education: InsertEducation): Promise<Education>;
  getUserEducations(userId: number): Promise<Education[]>;
  updateEducation(id: number, data: Partial<Education>): Promise<Education | undefined>;
  deleteEducation(id: number): Promise<boolean>;
  
  // Skills
  createSkill(skill: InsertSkill): Promise<Skill>;
  getUserSkills(userId: number): Promise<Skill[]>;
  deleteSkill(id: number): Promise<boolean>;
  
  // Resume
  updateUserResume(userId: number, path: string): Promise<User | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private jobs: Map<number, Job>;
  private swipes: Map<number, Swipe>;
  private recruiterInterests: Map<number, RecruiterInterest>;
  private matches: Map<number, Match>;
  private workExperiences: Map<number, WorkExperience>;
  private educations: Map<number, Education>;
  private skills: Map<number, Skill>;
  
  currentUserId: number;
  currentJobId: number;
  currentSwipeId: number;
  currentInterestId: number;
  currentMatchId: number;
  currentWorkExperienceId: number;
  currentEducationId: number;
  currentSkillId: number;

  constructor() {
    this.users = new Map();
    this.jobs = new Map();
    this.swipes = new Map();
    this.recruiterInterests = new Map();
    this.matches = new Map();
    this.workExperiences = new Map();
    this.educations = new Map();
    this.skills = new Map();
    
    this.currentUserId = 1;
    this.currentJobId = 1;
    this.currentSwipeId = 1;
    this.currentInterestId = 1;
    this.currentMatchId = 1;
    this.currentWorkExperienceId = 1;
    this.currentEducationId = 1;
    this.currentSkillId = 1;
    
    // Initialize with some sample job data
    this.initSampleJobs();
  }

  private initSampleJobs() {
    const sampleJobs: InsertJob[] = [
      {
        title: "Senior UX Designer",
        company: "TechCorp Solutions",
        location: "San Francisco, CA",
        salary: "$90,000 - $120,000",
        jobType: "Full-time",
        remote: true,
        description: "We're looking for a Senior UX Designer to join our product team. You'll work closely with developers and product managers to create intuitive user experiences.",
        requirements: "5+ years of experience in UX design\nProficiency in Figma and design systems\nExperience with user research and testing\nStrong portfolio of digital products",
        companyImage: "https://images.unsplash.com/photo-1560179707-f14e90ef3623",
        companyBackground: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab"
      },
      {
        title: "Frontend Developer",
        company: "GrowthWave Inc.",
        location: "Remote",
        salary: "$80,000 - $110,000",
        jobType: "Full-time",
        remote: true,
        description: "Join our team as a Frontend Developer working on cutting-edge web applications. You'll collaborate with designers and backend engineers to build responsive user interfaces.",
        requirements: "3+ years of experience with React\nStrong JavaScript and TypeScript skills\nFamiliarity with modern frontend tooling\nExperience with responsive design",
        companyImage: "https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0",
        companyBackground: "https://images.unsplash.com/photo-1568992687947-868a62a9f521"
      },
      {
        title: "Marketing Manager",
        company: "Elevate Brands",
        location: "New York, NY",
        salary: "$75,000 - $95,000",
        jobType: "Full-time",
        remote: false,
        description: "Lead our marketing efforts across digital channels. Develop and implement marketing strategies to increase brand awareness and drive customer acquisition.",
        requirements: "5+ years of experience in digital marketing\nExperience with social media campaign management\nAnalytical skills for measuring campaign performance\nStrong communication skills",
        companyImage: "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2",
        companyBackground: "https://images.unsplash.com/photo-1497215842964-222b430dc094"
      },
      {
        title: "Data Analyst",
        company: "DataFlow Analytics",
        location: "Chicago, IL",
        salary: "$70,000 - $90,000",
        jobType: "Full-time",
        remote: true,
        description: "Analyze large datasets to extract valuable insights for our clients. Create reports and dashboards to communicate findings effectively.",
        requirements: "Experience with SQL and data visualization tools\nProficiency in Python or R for data analysis\nStrong problem-solving abilities\nKnowledge of statistical methods",
        companyImage: "https://images.unsplash.com/photo-1560472355-536de3962603",
        companyBackground: "https://images.unsplash.com/photo-1551033406-611cf9a28f67"
      },
      {
        title: "Product Manager",
        company: "Innovate Solutions",
        location: "Austin, TX",
        salary: "$100,000 - $130,000",
        jobType: "Full-time",
        remote: true,
        description: "Drive product strategy and roadmap for our SaaS platform. Work with cross-functional teams to deliver high-quality product features.",
        requirements: "3+ years of experience in product management\nStrong understanding of agile methodologies\nExcellent communication and leadership skills\nTechnical background preferred",
        companyImage: "https://images.unsplash.com/photo-1560179707-f14e90ef3623",
        companyBackground: "https://images.unsplash.com/photo-1497366811353-6870744d04b2"
      }
    ];

    sampleJobs.forEach(job => {
      this.createJob(job);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null,
      email: insertUser.email || null,
      phone: insertUser.phone || null,
      title: insertUser.title || null,
      location: insertUser.location || null,
      about: insertUser.about || null,
      profileImage: insertUser.profileImage || null,
      resumePath: null,
      resumeUpdatedAt: null
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Job methods
  async getJob(id: number): Promise<Job | undefined> {
    return this.jobs.get(id);
  }

  async getJobs(filters?: JobFilters): Promise<Job[]> {
    let jobs = Array.from(this.jobs.values());
    
    if (filters) {
      // Apply filters
      if (filters.source) {
        jobs = jobs.filter(job => job.source === filters.source);
      }
      
      if (filters.jobType) {
        jobs = jobs.filter(job => job.jobType === filters.jobType);
      }
      
      if (filters.location) {
        jobs = jobs.filter(job => job.location && job.location.toLowerCase().includes(filters.location!.toLowerCase()));
      }
      
      if (filters.remote !== undefined) {
        jobs = jobs.filter(job => job.remote === filters.remote);
      }
      
      if (filters.search) {
        const searchTerms = filters.search.toLowerCase();
        jobs = jobs.filter(job => 
          (job.title && job.title.toLowerCase().includes(searchTerms)) ||
          (job.company && job.company.toLowerCase().includes(searchTerms)) ||
          (job.description && job.description.toLowerCase().includes(searchTerms))
        );
      }
    }
    
    return jobs;
  }

  async createJob(insertJob: InsertJob): Promise<Job> {
    const id = this.currentJobId++;
    const now = new Date();
    const job: Job = { 
      ...insertJob, 
      id, 
      postedAt: now,
      lastUpdated: now,
      // Set default values for optional fields
      location: insertJob.location || null,
      salary: insertJob.salary || null,
      jobType: insertJob.jobType || null,
      remote: insertJob.remote || false,
      description: insertJob.description || null,
      requirements: insertJob.requirements || null,
      companyImage: insertJob.companyImage || null,
      companyBackground: insertJob.companyBackground || null,
      applicationUrl: insertJob.applicationUrl || null,
      source: insertJob.source || "internal",
      sourceJobId: insertJob.sourceJobId || `internal-${id}`
    };
    this.jobs.set(id, job);
    return job;
  }

  // Swipe methods
  async createSwipe(insertSwipe: InsertSwipe): Promise<Swipe> {
    const id = this.currentSwipeId++;
    const now = new Date();
    const swipe: Swipe = { ...insertSwipe, id, createdAt: now };
    this.swipes.set(id, swipe);
    
    // Check if this creates a match
    if (swipe.liked) {
      const hasRecruiterInterest = Array.from(this.recruiterInterests.values()).some(
        interest => interest.jobId === swipe.jobId && interest.userId === swipe.userId
      );
      
      if (hasRecruiterInterest) {
        // Create a match
        const match: InsertMatch = {
          userId: swipe.userId,
          jobId: swipe.jobId,
          status: "new"
        };
        this.createMatch(match);
      }
    }
    
    return swipe;
  }

  async getUserSwipes(userId: number): Promise<Swipe[]> {
    return Array.from(this.swipes.values()).filter(
      swipe => swipe.userId === userId
    );
  }

  async getSwipe(userId: number, jobId: number): Promise<Swipe | undefined> {
    return Array.from(this.swipes.values()).find(
      swipe => swipe.userId === userId && swipe.jobId === jobId
    );
  }

  // Recruiter Interest methods
  async createRecruiterInterest(insertInterest: InsertRecruiterInterest): Promise<RecruiterInterest> {
    const id = this.currentInterestId++;
    const now = new Date();
    const interest: RecruiterInterest = { ...insertInterest, id, createdAt: now };
    this.recruiterInterests.set(id, interest);
    
    // Check if this creates a match
    const userLikedJob = Array.from(this.swipes.values()).some(
      swipe => swipe.jobId === interest.jobId && 
               swipe.userId === interest.userId && 
               swipe.liked
    );
    
    if (userLikedJob) {
      // Create a match
      const match: InsertMatch = {
        userId: interest.userId,
        jobId: interest.jobId,
        status: "new"
      };
      this.createMatch(match);
    }
    
    return interest;
  }

  async getRecruiterInterests(jobId: number): Promise<RecruiterInterest[]> {
    return Array.from(this.recruiterInterests.values()).filter(
      interest => interest.jobId === jobId
    );
  }

  // Match methods
  async createMatch(insertMatch: InsertMatch): Promise<Match> {
    const id = this.currentMatchId++;
    const now = new Date();
    const match: Match = { ...insertMatch, id, createdAt: now };
    this.matches.set(id, match);
    return match;
  }

  async getUserMatches(userId: number): Promise<Match[]> {
    return Array.from(this.matches.values()).filter(
      match => match.userId === userId
    );
  }

  async getMatchesByStatus(userId: number, status: string): Promise<Match[]> {
    return Array.from(this.matches.values()).filter(
      match => match.userId === userId && match.status === status
    );
  }

  async updateMatchStatus(id: number, status: string): Promise<Match | undefined> {
    const match = this.matches.get(id);
    if (!match) return undefined;
    
    const updatedMatch = { ...match, status };
    this.matches.set(id, updatedMatch);
    return updatedMatch;
  }

  async getMatch(userId: number, jobId: number): Promise<Match | undefined> {
    return Array.from(this.matches.values()).find(
      match => match.userId === userId && match.jobId === jobId
    );
  }

  // Work Experience methods
  async createWorkExperience(insertExperience: InsertWorkExperience): Promise<WorkExperience> {
    const id = this.currentWorkExperienceId++;
    const experience: WorkExperience = { ...insertExperience, id };
    this.workExperiences.set(id, experience);
    return experience;
  }

  async getUserWorkExperiences(userId: number): Promise<WorkExperience[]> {
    return Array.from(this.workExperiences.values()).filter(
      exp => exp.userId === userId
    );
  }

  async updateWorkExperience(id: number, data: Partial<WorkExperience>): Promise<WorkExperience | undefined> {
    const experience = this.workExperiences.get(id);
    if (!experience) return undefined;
    
    const updatedExperience = { ...experience, ...data };
    this.workExperiences.set(id, updatedExperience);
    return updatedExperience;
  }

  async deleteWorkExperience(id: number): Promise<boolean> {
    return this.workExperiences.delete(id);
  }

  // Education methods
  async createEducation(insertEducation: InsertEducation): Promise<Education> {
    const id = this.currentEducationId++;
    const education: Education = { ...insertEducation, id };
    this.educations.set(id, education);
    return education;
  }

  async getUserEducations(userId: number): Promise<Education[]> {
    return Array.from(this.educations.values()).filter(
      edu => edu.userId === userId
    );
  }

  async updateEducation(id: number, data: Partial<Education>): Promise<Education | undefined> {
    const education = this.educations.get(id);
    if (!education) return undefined;
    
    const updatedEducation = { ...education, ...data };
    this.educations.set(id, updatedEducation);
    return updatedEducation;
  }

  async deleteEducation(id: number): Promise<boolean> {
    return this.educations.delete(id);
  }

  // Skills methods
  async createSkill(insertSkill: InsertSkill): Promise<Skill> {
    const id = this.currentSkillId++;
    const skill: Skill = { ...insertSkill, id };
    this.skills.set(id, skill);
    return skill;
  }

  async getUserSkills(userId: number): Promise<Skill[]> {
    return Array.from(this.skills.values()).filter(
      skill => skill.userId === userId
    );
  }

  async deleteSkill(id: number): Promise<boolean> {
    return this.skills.delete(id);
  }

  // Resume methods
  async updateUserResume(userId: number, path: string): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;
    
    const now = new Date();
    const updatedUser = { ...user, resumePath: path, resumeUpdatedAt: now };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
}

// Import DatabaseStorage
import { DatabaseStorage } from "./storage-db";

// Choose which storage implementation to use
const useDatabase = process.env.DATABASE_URL !== undefined;
export const storage = useDatabase ? new DatabaseStorage() : new MemStorage();
