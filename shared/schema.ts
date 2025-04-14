import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email"),
  phone: text("phone"),
  title: text("title"),
  location: text("location"),
  about: text("about"),
  profileImage: text("profile_image"),
  resumePath: text("resume_path"),
  resumeUpdatedAt: timestamp("resume_updated_at"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  title: true,
  location: true,
  about: true,
  profileImage: true,
});

// Jobs
export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  location: text("location"),
  salary: text("salary"),
  jobType: text("job_type"),
  remote: boolean("remote"),
  description: text("description"),
  requirements: text("requirements"),
  postedAt: timestamp("posted_at").defaultNow(),
  companyImage: text("company_image"),
  companyBackground: text("company_background"),
  applicationUrl: text("application_url"),
  source: text("source"), // LinkedIn, Indeed, Naukri, etc.
  sourceJobId: text("source_job_id"), // ID of the job in the source platform
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const insertJobSchema = createInsertSchema(jobs).pick({
  title: true,
  company: true,
  location: true,
  salary: true,
  jobType: true,
  remote: true,
  description: true,
  requirements: true,
  companyImage: true,
  companyBackground: true,
  applicationUrl: true,
  source: true,
  sourceJobId: true,
});

// Swipes (job interactions)
export const swipes = pgTable("swipes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  jobId: integer("job_id").notNull(),
  liked: boolean("liked").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSwipeSchema = createInsertSchema(swipes).pick({
  userId: true,
  jobId: true,
  liked: true,
});

// Recruiter interactions (representing recruiter interest)
export const recruiterInterests = pgTable("recruiter_interests", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").notNull(),
  userId: integer("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertRecruiterInterestSchema = createInsertSchema(recruiterInterests).pick({
  jobId: true,
  userId: true,
});

// Matches (when both user and recruiter show interest)
export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  jobId: integer("job_id").notNull(),
  status: text("status").notNull().default("new"),  // new, in_process, interview, offer
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMatchSchema = createInsertSchema(matches).pick({
  userId: true,
  jobId: true,
  status: true,
});

// Work experience
export const workExperiences = pgTable("work_experiences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  current: boolean("current").default(false),
  description: text("description"),
});

export const insertWorkExperienceSchema = createInsertSchema(workExperiences).omit({
  id: true,
});

// Education
export const educations = pgTable("educations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  degree: text("degree").notNull(),
  institution: text("institution").notNull(),
  startYear: text("start_year").notNull(),
  endYear: text("end_year"),
  description: text("description"),
});

export const insertEducationSchema = createInsertSchema(educations).omit({
  id: true,
});

// Skills
export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
});

export const insertSkillSchema = createInsertSchema(skills).omit({
  id: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;
export type Swipe = typeof swipes.$inferSelect;
export type InsertSwipe = z.infer<typeof insertSwipeSchema>;
export type RecruiterInterest = typeof recruiterInterests.$inferSelect;
export type InsertRecruiterInterest = z.infer<typeof insertRecruiterInterestSchema>;
export type Match = typeof matches.$inferSelect;
export type InsertMatch = z.infer<typeof insertMatchSchema>;
export type WorkExperience = typeof workExperiences.$inferSelect;
export type InsertWorkExperience = z.infer<typeof insertWorkExperienceSchema>;
export type Education = typeof educations.$inferSelect;
export type InsertEducation = z.infer<typeof insertEducationSchema>;
export type Skill = typeof skills.$inferSelect;
export type InsertSkill = z.infer<typeof insertSkillSchema>;
