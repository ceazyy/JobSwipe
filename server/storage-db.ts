import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import {
  users, skills, workExperiences, educations,
  jobs, swipes, recruiterInterests, matches,
  type User, type InsertUser, type Job, type InsertJob, 
  type Swipe, type InsertSwipe, type RecruiterInterest, 
  type InsertRecruiterInterest, type Match, type InsertMatch,
  type WorkExperience, type InsertWorkExperience, 
  type Education, type InsertEducation, type Skill, type InsertSkill
} from "@shared/schema";
import { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  // Job methods
  async getJob(id: number): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
    return job;
  }

  async getJobs(): Promise<Job[]> {
    return db.select().from(jobs).orderBy(desc(jobs.postedAt));
  }

  async createJob(insertJob: InsertJob): Promise<Job> {
    const now = new Date();
    const [job] = await db.insert(jobs).values({
      ...insertJob,
      postedAt: now
    }).returning();
    return job;
  }

  // Swipe methods
  async createSwipe(insertSwipe: InsertSwipe): Promise<Swipe> {
    const now = new Date();
    const [swipe] = await db.insert(swipes).values({
      ...insertSwipe,
      createdAt: now
    }).returning();

    // Check for matches when a user likes a job
    if (insertSwipe.liked) {
      // Check if there's a recruiter interest for this job and user
      const [interest] = await db.select()
        .from(recruiterInterests)
        .where(
          and(
            eq(recruiterInterests.jobId, insertSwipe.jobId),
            eq(recruiterInterests.userId, insertSwipe.userId)
          )
        );

      // If there's a match, create a match record
      if (interest) {
        await this.createMatch({
          userId: insertSwipe.userId,
          jobId: insertSwipe.jobId,
          status: "new"
        });
      }
    }

    return swipe;
  }

  async getUserSwipes(userId: number): Promise<Swipe[]> {
    return db.select()
      .from(swipes)
      .where(eq(swipes.userId, userId))
      .orderBy(desc(swipes.createdAt));
  }

  async getSwipe(userId: number, jobId: number): Promise<Swipe | undefined> {
    const [swipe] = await db.select()
      .from(swipes)
      .where(
        and(
          eq(swipes.userId, userId),
          eq(swipes.jobId, jobId)
        )
      );
    return swipe;
  }

  // Recruiter Interest methods
  async createRecruiterInterest(insertInterest: InsertRecruiterInterest): Promise<RecruiterInterest> {
    const now = new Date();
    const [interest] = await db.insert(recruiterInterests).values({
      ...insertInterest,
      createdAt: now
    }).returning();

    // Check for matches when a recruiter is interested in a user
    // Look for a swipe from this user for this job
    const [swipe] = await db.select()
      .from(swipes)
      .where(
        and(
          eq(swipes.userId, insertInterest.userId),
          eq(swipes.jobId, insertInterest.jobId),
          eq(swipes.liked, true)
        )
      );

    // If there's a match, create a match record
    if (swipe) {
      await this.createMatch({
        userId: insertInterest.userId,
        jobId: insertInterest.jobId,
        status: "new"
      });
    }

    return interest;
  }

  async getRecruiterInterests(jobId: number): Promise<RecruiterInterest[]> {
    return db.select()
      .from(recruiterInterests)
      .where(eq(recruiterInterests.jobId, jobId))
      .orderBy(desc(recruiterInterests.createdAt));
  }

  // Match methods
  async createMatch(insertMatch: InsertMatch): Promise<Match> {
    const now = new Date();
    
    // Check if match already exists
    const [existingMatch] = await db.select()
      .from(matches)
      .where(
        and(
          eq(matches.userId, insertMatch.userId),
          eq(matches.jobId, insertMatch.jobId)
        )
      );
    
    if (existingMatch) {
      return existingMatch;
    }
    
    const [match] = await db.insert(matches).values({
      ...insertMatch,
      createdAt: now
    }).returning();
    return match;
  }

  async getUserMatches(userId: number): Promise<Match[]> {
    return db.select()
      .from(matches)
      .where(eq(matches.userId, userId))
      .orderBy(desc(matches.createdAt));
  }

  async getMatchesByStatus(userId: number, status: string): Promise<Match[]> {
    return db.select()
      .from(matches)
      .where(
        and(
          eq(matches.userId, userId),
          eq(matches.status, status)
        )
      )
      .orderBy(desc(matches.createdAt));
  }

  async updateMatchStatus(id: number, status: string): Promise<Match | undefined> {
    const [match] = await db.update(matches)
      .set({ status })
      .where(eq(matches.id, id))
      .returning();
    return match;
  }

  async getMatch(userId: number, jobId: number): Promise<Match | undefined> {
    const [match] = await db.select()
      .from(matches)
      .where(
        and(
          eq(matches.userId, userId),
          eq(matches.jobId, jobId)
        )
      );
    return match;
  }

  // Work Experience methods
  async createWorkExperience(insertExperience: InsertWorkExperience): Promise<WorkExperience> {
    const [experience] = await db.insert(workExperiences)
      .values(insertExperience)
      .returning();
    return experience;
  }

  async getUserWorkExperiences(userId: number): Promise<WorkExperience[]> {
    return db.select()
      .from(workExperiences)
      .where(eq(workExperiences.userId, userId));
  }

  async updateWorkExperience(id: number, data: Partial<WorkExperience>): Promise<WorkExperience | undefined> {
    const [experience] = await db.update(workExperiences)
      .set(data)
      .where(eq(workExperiences.id, id))
      .returning();
    return experience;
  }

  async deleteWorkExperience(id: number): Promise<boolean> {
    const deleted = await db.delete(workExperiences)
      .where(eq(workExperiences.id, id))
      .returning();
    return deleted.length > 0;
  }

  // Education methods
  async createEducation(insertEducation: InsertEducation): Promise<Education> {
    const [education] = await db.insert(educations)
      .values(insertEducation)
      .returning();
    return education;
  }

  async getUserEducations(userId: number): Promise<Education[]> {
    return db.select()
      .from(educations)
      .where(eq(educations.userId, userId));
  }

  async updateEducation(id: number, data: Partial<Education>): Promise<Education | undefined> {
    const [education] = await db.update(educations)
      .set(data)
      .where(eq(educations.id, id))
      .returning();
    return education;
  }

  async deleteEducation(id: number): Promise<boolean> {
    const deleted = await db.delete(educations)
      .where(eq(educations.id, id))
      .returning();
    return deleted.length > 0;
  }

  // Skills methods
  async createSkill(insertSkill: InsertSkill): Promise<Skill> {
    const [skill] = await db.insert(skills)
      .values(insertSkill)
      .returning();
    return skill;
  }

  async getUserSkills(userId: number): Promise<Skill[]> {
    return db.select()
      .from(skills)
      .where(eq(skills.userId, userId));
  }

  async deleteSkill(id: number): Promise<boolean> {
    const deleted = await db.delete(skills)
      .where(eq(skills.id, id))
      .returning();
    return deleted.length > 0;
  }

  // Resume methods
  async updateUserResume(userId: number, path: string): Promise<User | undefined> {
    const now = new Date();
    const [user] = await db.update(users)
      .set({ 
        resumePath: path,
        resumeUpdatedAt: now
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }
}