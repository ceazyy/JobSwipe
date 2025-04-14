import OpenAI from "openai";
import { User, Job, WorkExperience, Education, Skill } from "@shared/schema";

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Helper function to handle null values in strings
function nullSafeString(value: string | null): string {
  return value || '';
}

/**
 * Resume Analysis Service
 * Uses OpenAI API to analyze resume components and provide insights
 */
export const resumeAnalysisService = {
  /**
   * Analyze user profile and extract skills
   */
  async extractSkillsFromProfile(user: User, workExperiences: WorkExperience[], educations: Education[]): Promise<string[]> {
    try {
      // Construct a complete profile from user data
      const profile = `
User Profile:
Name: ${user.firstName || ''} ${user.lastName || ''}
Current Title: ${nullSafeString(user.title)}
Location: ${nullSafeString(user.location)}
About: ${nullSafeString(user.about)}

Work Experience:
${workExperiences.map(exp => `- ${exp.title} at ${exp.company} (${exp.startDate} - ${nullSafeString(exp.endDate) || 'Present'})
  ${nullSafeString(exp.description) || 'No description provided'}`).join('\n')}

Education:
${educations.map(edu => `- ${edu.degree} at ${edu.institution} (${edu.startYear} - ${nullSafeString(edu.endYear) || 'Present'})
  ${nullSafeString(edu.description) || 'No description provided'}`).join('\n')}
`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a professional career advisor and resume analyzer. Extract a comprehensive list of professional skills from the user's profile."
          },
          {
            role: "user",
            content: `Please analyze this professional profile and extract a list of skills the person likely has based on their experience and education. Format the response as a JSON array of strings. ${profile}`
          }
        ],
        response_format: { type: "json_object" }
      });

      const result = JSON.parse(response.choices[0].message.content);
      return result.skills || [];
    } catch (error) {
      console.error("Error extracting skills from profile:", error);
      return [];
    }
  },

  /**
   * Score job match based on user profile
   */
  async scoreJobMatch(user: User, job: Job, userSkills: Skill[]): Promise<{
    score: number;
    matchingSummary: string;
    missingSkills: string[];
    recommendedAction: string;
  }> {
    try {
      // Construct context for analysis
      const profile = `
User Profile:
Name: ${user.firstName || ''} ${user.lastName || ''}
Current Title: ${nullSafeString(user.title)}
Location: ${nullSafeString(user.location)}
About: ${nullSafeString(user.about)}

Skills: ${userSkills.map(skill => skill.name).join(', ')}
`;

      const jobInfo = `
Job Details:
Title: ${job.title}
Company: ${job.company}
Location: ${nullSafeString(job.location)}
Job Type: ${nullSafeString(job.jobType)}
Remote: ${job.remote ? 'Yes' : 'No'}

Description: ${nullSafeString(job.description)}

Requirements: ${nullSafeString(job.requirements)}
`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a professional career advisor specializing in job matching. Analyze how well a candidate's profile matches a job description."
          },
          {
            role: "user",
            content: `Please analyze how well this candidate's profile matches the job description.
            
${profile}

${jobInfo}

Provide your analysis in JSON format with these fields:
- score: a number between 0 and 100 representing the match percentage
- matchingSummary: a summary of why the person is a good match
- missingSkills: an array of skills the person should develop to be a better match
- recommendedAction: a suggestion for the user (apply immediately, improve resume first, etc.)
`
          }
        ],
        response_format: { type: "json_object" }
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error("Error scoring job match:", error);
      return {
        score: 0,
        matchingSummary: "Unable to analyze match at this time.",
        missingSkills: [],
        recommendedAction: "Try again later."
      };
    }
  },

  /**
   * Generate a personalized cover letter
   */
  async generateCoverLetter(user: User, job: Job, workExperiences: WorkExperience[]): Promise<string> {
    try {
      // Construct context for cover letter generation
      const profile = `
User Profile:
Name: ${user.firstName || ''} ${user.lastName || ''}
Current Title: ${nullSafeString(user.title)}
Location: ${nullSafeString(user.location)}
About: ${nullSafeString(user.about)}

Work Experience:
${workExperiences.map(exp => `- ${exp.title} at ${exp.company} (${exp.startDate} - ${nullSafeString(exp.endDate) || 'Present'})
  ${nullSafeString(exp.description) || 'No description provided'}`).join('\n')}
`;

      const jobInfo = `
Job Details:
Title: ${job.title}
Company: ${job.company}
Location: ${nullSafeString(job.location)}
Job Type: ${nullSafeString(job.jobType)}

Description: ${nullSafeString(job.description)}

Requirements: ${nullSafeString(job.requirements)}
`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert cover letter writer who specializes in creating compelling, personalized cover letters that highlight a candidate's relevant experience and skills for specific job opportunities."
          },
          {
            role: "user",
            content: `Create a professional cover letter for the following job application. The cover letter should highlight relevant experience and skills, demonstrate understanding of the company, and express enthusiasm for the role.
            
${profile}

${jobInfo}

The cover letter should be well-structured with:
1. A personalized greeting
2. An engaging opening paragraph expressing interest
3. 1-2 paragraphs highlighting relevant experience and achievements
4. A closing paragraph with a call to action
5. A professional sign-off

Keep the tone professional but conversational. Don't exceed 350 words.`
          }
        ]
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error("Error generating cover letter:", error);
      return "Unable to generate cover letter at this time. Please try again later.";
    }
  },

  /**
   * Analyze application status and provide interview tips
   */
  async getInterviewTips(job: Job): Promise<{
    preparationTips: string[];
    commonQuestions: string[];
    keySkillsToHighlight: string[];
  }> {
    try {
      const jobInfo = `
Job Details:
Title: ${job.title}
Company: ${job.company}
Description: ${nullSafeString(job.description)}
Requirements: ${nullSafeString(job.requirements)}
`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert career coach specializing in interview preparation. Provide practical, specific advice for job interviews."
          },
          {
            role: "user",
            content: `I have an interview for the following position. Please provide interview preparation tips, common questions I might face, and key skills I should highlight.
            
${jobInfo}

Format your response as a JSON object with these fields:
- preparationTips: an array of 5 specific preparation suggestions 
- commonQuestions: an array of 5 likely interview questions for this role
- keySkillsToHighlight: an array of 5 key skills or experiences to emphasize
`
          }
        ],
        response_format: { type: "json_object" }
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error("Error getting interview tips:", error);
      return {
        preparationTips: ["Research the company before the interview.", "Prepare examples of your past work.", "Practice your responses to common questions.", "Prepare questions to ask the interviewer.", "Follow up after the interview with a thank-you note."],
        commonQuestions: ["Tell me about yourself.", "Why are you interested in this role?", "What are your strengths and weaknesses?", "Tell me about a challenge you faced and how you overcame it.", "Where do you see yourself in 5 years?"],
        keySkillsToHighlight: ["Communication skills", "Problem-solving abilities", "Technical expertise", "Teamwork experience", "Leadership qualities"]
      };
    }
  }
};

/**
 * Job Analysis Service
 * Uses OpenAI API to analyze job listings and provide insights
 */
export const jobAnalysisService = {
  /**
   * Extract key requirements and skills from job description
   */
  async extractJobRequirements(job: Job): Promise<{
    hardSkills: string[];
    softSkills: string[];
    experienceLevel: string;
    educationLevel: string;
    keyResponsibilities: string[];
  }> {
    try {
      const jobInfo = `
Job Details:
Title: ${job.title}
Company: ${job.company}
Description: ${nullSafeString(job.description)}
Requirements: ${nullSafeString(job.requirements)}
`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert job analyst who extracts precise details from job listings."
          },
          {
            role: "user",
            content: `Analyze this job listing and extract the key requirements and skills needed.
            
${jobInfo}

Format your response as a JSON object with these fields:
- hardSkills: an array of technical skills required
- softSkills: an array of interpersonal skills mentioned
- experienceLevel: years of experience required (entry, mid, senior)
- educationLevel: minimum education requirement
- keyResponsibilities: an array of main job responsibilities
`
          }
        ],
        response_format: { type: "json_object" }
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error("Error extracting job requirements:", error);
      return {
        hardSkills: [],
        softSkills: [],
        experienceLevel: "Not specified",
        educationLevel: "Not specified",
        keyResponsibilities: []
      };
    }
  },

  /**
   * Suggest improvements for job application
   */
  async suggestApplicationImprovements(user: User, job: Job): Promise<{
    resumeSuggestions: string[];
    coverLetterFocus: string[];
    additionalCertifications: string[];
  }> {
    try {
      const profile = `
User Profile:
Name: ${user.firstName || ''} ${user.lastName || ''}
Current Title: ${nullSafeString(user.title)}
About: ${nullSafeString(user.about)}
`;

      const jobInfo = `
Job Details:
Title: ${job.title}
Company: ${job.company}
Description: ${nullSafeString(job.description)}
Requirements: ${nullSafeString(job.requirements)}
`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert career advisor who helps job seekers improve their application materials for specific positions."
          },
          {
            role: "user",
            content: `I'm applying for this job. Please suggest specific improvements for my application materials based on my profile and the job requirements.
            
${profile}

${jobInfo}

Format your response as a JSON object with these fields:
- resumeSuggestions: an array of specific improvements for my resume
- coverLetterFocus: an array of key points to emphasize in my cover letter
- additionalCertifications: an array of certifications or courses that would strengthen my application
`
          }
        ],
        response_format: { type: "json_object" }
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error("Error suggesting application improvements:", error);
      return {
        resumeSuggestions: ["Tailor your resume to highlight relevant experience.", "Use keywords from the job description.", "Quantify your achievements with specific metrics."],
        coverLetterFocus: ["Express genuine interest in the company.", "Highlight your most relevant skills.", "Connect your experience to the job requirements."],
        additionalCertifications: ["Consider relevant industry certifications.", "Look for online courses to enhance your skills."]
      };
    }
  }
};