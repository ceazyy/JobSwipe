import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import type { Job, Skill } from "@shared/schema";

/**
 * Hook for using AI-powered services in the application
 */
export function useAIServices() {
  // Extract skills from user profile
  const useExtractSkills = () => {
    return useQuery({
      queryKey: ['/api/ai/extract-skills'],
      enabled: false, // Only fetch when explicitly requested
    });
  };

  // Score job match based on user profile
  const useJobMatch = (jobId?: number) => {
    return useQuery({
      queryKey: ['/api/ai/job-match', jobId],
      enabled: !!jobId, // Only fetch when jobId is provided
    });
  };

  // Generate a cover letter
  const useGenerateCoverLetter = (jobId?: number) => {
    return useQuery({
      queryKey: ['/api/ai/cover-letter', jobId],
      enabled: false, // Only fetch when explicitly requested
    });
  };

  // Get interview tips for a job
  const useInterviewTips = (jobId?: number) => {
    return useQuery({
      queryKey: ['/api/ai/interview-tips', jobId],
      enabled: false, // Only fetch when explicitly requested
    });
  };

  // Extract job requirements
  const useJobRequirements = (jobId?: number) => {
    return useQuery({
      queryKey: ['/api/ai/job-requirements', jobId],
      enabled: false, // Only fetch when explicitly requested
    });
  };

  // Get application improvement suggestions
  const useApplicationImprovements = (jobId?: number) => {
    return useQuery({
      queryKey: ['/api/ai/application-improvements', jobId],
      enabled: false, // Only fetch when explicitly requested
    });
  };

  // Add a skill from AI suggestions to user profile
  const useAddSkill = () => {
    return useMutation({
      mutationFn: async (skill: {userId: number, name: string}) => {
        const res = await fetch('/api/skills', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(skill),
        });
        
        if (!res.ok) {
          throw new Error('Failed to add skill');
        }
        
        return res.json();
      },
      onSuccess: () => {
        // Invalidate skills query to refetch user skills
        queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      },
    });
  };

  // Create a type for the job match score
  type JobMatchScore = {
    score: number;
    matchingSummary: string;
    missingSkills: string[];
    recommendedAction: string;
  };

  // Create a type for interview tips
  type InterviewTips = {
    preparationTips: string[];
    commonQuestions: string[];
    keySkillsToHighlight: string[];
  };

  // Create a type for job requirements
  type JobRequirements = {
    hardSkills: string[];
    softSkills: string[];
    experienceLevel: string;
    educationLevel: string;
    keyResponsibilities: string[];
  };

  // Create a type for application improvements
  type ApplicationImprovements = {
    resumeSuggestions: string[];
    coverLetterFocus: string[];
    additionalCertifications: string[];
  };

  return {
    useExtractSkills,
    useJobMatch,
    useGenerateCoverLetter,
    useInterviewTips,
    useJobRequirements,
    useApplicationImprovements,
    useAddSkill,
  };
}