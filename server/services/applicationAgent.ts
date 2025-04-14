import * as puppeteer from 'puppeteer';
import { storage } from '../storage';
import { db } from '../db';
import { matches, recruiterInterests, type User } from '@shared/schema';
import { eq } from 'drizzle-orm';

interface ApplicationField {
  name: string;
  type: 'text' | 'select' | 'checkbox' | 'radio' | 'file' | 'email' | 'tel';
  selector: string;
  required: boolean;
  userProfileMapping?: keyof User;
  defaultValue?: string;
}

interface ApplicationSubmissionResult {
  success: boolean;
  redirectUrl?: string;
  message: string;
  matchCreated?: boolean;
}

// Generic form analyzer
async function analyzeApplicationForm(page: puppeteer.Page): Promise<ApplicationField[]> {
  return await page.evaluate(() => {
    const fields: ApplicationField[] = [];
    const formElements = document.querySelectorAll('form input, form select, form textarea');
    
    formElements.forEach((element: HTMLElement) => {
      if (element instanceof HTMLInputElement || 
          element instanceof HTMLSelectElement || 
          element instanceof HTMLTextAreaElement) {
        
        let type: ApplicationField['type'] = 'text';
        if (element instanceof HTMLInputElement) {
          if (['checkbox', 'radio', 'file'].includes(element.type)) {
            type = element.type as ApplicationField['type'];
          } else if (element.type === 'email') {
            type = 'email';
          } else if (element.type === 'tel') {
            type = 'tel';
          }
        } else if (element instanceof HTMLSelectElement) {
          type = 'select';
        }
        
        // Generate a unique selector for this element
        const selector = generateSelector(element);
        
        // Infer field name from attributes or nearby labels
        let name = element.name || element.id || '';
        const labelElement = document.querySelector(`label[for="${element.id}"]`);
        if (labelElement) {
          name = labelElement.textContent?.trim() || name;
        }
        
        // Determine mapping to user profile fields
        const userProfileMapping = inferUserProfileMapping(name.toLowerCase());
        
        fields.push({
          name,
          type,
          selector,
          required: element.required,
          userProfileMapping,
        });
      }
    });
    
    return fields;
    
    // Helper function to generate a unique selector
    function generateSelector(element: HTMLElement): string {
      if (element.id) {
        return `#${element.id}`;
      } else if (element.name) {
        return `[name="${element.name}"]`;
      } else {
        // Create a selector based on element attributes and position
        let selector = element.tagName.toLowerCase();
        if (element.className) {
          const classList = element.className.split(' ').filter(c => c);
          if (classList.length > 0) {
            selector += `.${classList.join('.')}`;
          }
        }
        
        // Add positional selector if needed
        const siblings = Array.from(element.parentElement?.children || []);
        if (siblings.length > 1) {
          const index = siblings.indexOf(element) + 1;
          selector += `:nth-child(${index})`;
        }
        
        return selector;
      }
    }
    
    // Helper function to map field names to user profile fields
    function inferUserProfileMapping(fieldName: string): keyof User | undefined {
      const mappings: Record<string, keyof User> = {
        'first name': 'firstName',
        'last name': 'lastName',
        'email': 'email',
        'phone': 'phone',
        'address': 'location',
        'location': 'location',
        'about': 'about',
        'summary': 'about',
        'current position': 'title',
        'job title': 'title',
        'title': 'title',
        'username': 'username',
      };
      
      for (const [key, value] of Object.entries(mappings)) {
        if (fieldName.includes(key)) {
          return value;
        }
      }
      
      return undefined;
    }
  });
}

// Submit application using user's profile data
export async function submitApplication(
  userId: number, 
  jobId: number, 
  redirectToUser: boolean = false
): Promise<ApplicationSubmissionResult> {
  try {
    // Get user and job data
    const user = await storage.getUser(userId);
    const job = await storage.getJob(jobId);
    
    if (!user || !job) {
      return { 
        success: false, 
        message: 'User or job not found' 
      };
    }
    
    if (!job.applicationUrl) {
      return {
        success: false,
        message: 'No application URL found for this job'
      };
    }
    
    // Launch browser
    const browser = await puppeteer.launch({
      headless: !redirectToUser, // Run in visible mode if we'll redirect to user
      args: ['--no-sandbox']
    });
    
    try {
      const page = await browser.newPage();
      
      // Set user agent to avoid detection
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      
      // Navigate to application page
      await page.goto(job.applicationUrl, { waitUntil: 'networkidle2' });
      
      // Check if we need to create an account first
      const requiresAccount = await page.evaluate(() => {
        const signInText = document.body.textContent?.toLowerCase() || '';
        return signInText.includes('sign in') || 
               signInText.includes('login') || 
               signInText.includes('create account');
      });
      
      if (requiresAccount && redirectToUser) {
        // Create a fake match for tracking purposes
        await createApplicationMatch(userId, jobId);
        
        // Generate URL for redirection
        const browserUrl = page.url();
        await browser.close();
        
        return {
          success: true,
          redirectUrl: browserUrl,
          message: 'Account creation required. Redirecting user to complete registration.',
          matchCreated: true
        };
      }
      
      // Analyze application form
      const formFields = await analyzeApplicationForm(page);
      
      // Fill form using user profile data
      for (const field of formFields) {
        if (field.userProfileMapping && user[field.userProfileMapping]) {
          const value = user[field.userProfileMapping] as string;
          
          if (field.type === 'text' || field.type === 'email' || field.type === 'tel') {
            await page.type(field.selector, value);
          } else if (field.type === 'select') {
            await page.select(field.selector, value);
          } else if (field.type === 'checkbox' || field.type === 'radio') {
            await page.click(field.selector);
          } else if (field.type === 'file' && field.name.toLowerCase().includes('resume') && user.resumePath) {
            await page.setInputFiles(field.selector, user.resumePath);
          }
        } else if (field.required) {
          // Handle required fields without mapping
          if (field.type === 'checkbox') {
            await page.click(field.selector);
          } else if (field.name.toLowerCase().includes('agree')) {
            await page.click(field.selector);
          }
        }
      }
      
      // Look for a submit button if we're not redirecting
      if (!redirectToUser) {
        const submitButton = await page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll('button, input[type="submit"]'));
          for (const button of buttons) {
            const text = button.textContent?.toLowerCase() || '';
            if (text.includes('submit') || text.includes('apply') || text.includes('send')) {
              return generateSelector(button);
            }
          }
          return null;
          
          function generateSelector(element: Element): string {
            if (element.id) {
              return `#${element.id}`;
            } else if (element instanceof HTMLInputElement && element.name) {
              return `input[name="${element.name}"]`;
            } else {
              return `${element.tagName.toLowerCase()}`;
            }
          }
        });
        
        if (submitButton) {
          await page.click(submitButton);
          await page.waitForNavigation({ waitUntil: 'networkidle2' });
          
          // Check for successful submission
          const isSuccess = await page.evaluate(() => {
            const pageText = document.body.textContent?.toLowerCase() || '';
            return pageText.includes('thank you') || 
                  pageText.includes('application submitted') ||
                  pageText.includes('application received');
          });
          
          if (isSuccess) {
            // Create a match record to track application
            await createApplicationMatch(userId, jobId);
          }
          
          await browser.close();
          
          return {
            success: isSuccess,
            message: isSuccess ? 'Application submitted successfully' : 'Application may not have been submitted successfully',
            matchCreated: isSuccess
          };
        } else {
          await browser.close();
          return {
            success: false,
            message: 'Could not find submit button on application form'
          };
        }
      } else {
        // For user redirection, return the current page URL
        const currentUrl = page.url();
        await browser.close();
        
        return {
          success: true,
          redirectUrl: currentUrl,
          message: 'User will complete the application manually'
        };
      }
    } catch (error) {
      await browser.close();
      throw error;
    }
  } catch (error) {
    console.error('Error submitting application:', error);
    return {
      success: false,
      message: `Error submitting application: ${error.message}`
    };
  }
}

// Create a match record for tracking the application
async function createApplicationMatch(userId: number, jobId: number) {
  // First create a recruiter interest record (since for our app, both parties need to show interest)
  await db.insert(recruiterInterests)
    .values({
      userId,
      jobId,
      createdAt: new Date()
    })
    .onConflictDoNothing();
  
  // Then create the match
  return storage.createMatch({
    userId,
    jobId,
    status: 'in_process'
  });
}

// Function to check application status 
export async function checkApplicationStatus(userId: number, jobId: number) {
  // This function would use web scraping to check application status
  // For now, we'll simulate this with random statuses
  const statuses = ['new', 'in_process', 'interview', 'offer'];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  
  // Update match status
  const match = await storage.getMatch(userId, jobId);
  if (match) {
    await storage.updateMatchStatus(match.id, randomStatus);
    return { success: true, status: randomStatus };
  }
  
  return { success: false, status: 'not_found' };
}

// API that will be exposed to the client
export const applicationAgentApi = {
  submitApplication,
  checkApplicationStatus
};