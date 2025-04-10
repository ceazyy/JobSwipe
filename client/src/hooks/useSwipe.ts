import { useState, useCallback } from "react";
import { Job } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface UseSwipeProps {
  userId: number;
  jobs: Job[];
  onMatchFound: (job: Job) => void;
}

interface UseSwipeResult {
  currentJobs: Job[];
  handleSwipe: (jobId: number, liked: boolean) => void;
  rejectJob: () => void;
  approveJob: () => void;
}

export const useSwipe = ({ userId, jobs, onMatchFound }: UseSwipeProps): UseSwipeResult => {
  const [swipedJobs, setSwipedJobs] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  const currentJobs = jobs.filter(job => !swipedJobs.has(job.id));

  const handleSwipe = useCallback(async (jobId: number, liked: boolean) => {
    try {
      // Record swipe in the backend
      const response = await apiRequest('POST', '/api/swipes', {
        userId,
        jobId,
        liked
      });
      
      // Add job to swiped jobs
      setSwipedJobs(prev => {
        const newSet = new Set(prev);
        newSet.add(jobId);
        return newSet;
      });
      
      // If this is a match, trigger the callback
      if (liked) {
        // For demo purposes, we'll simulate a match with a 30% chance
        // In a real app, this would come from the backend
        const isMatch = Math.random() < 0.3;
        
        if (isMatch) {
          const matchedJob = jobs.find(job => job.id === jobId);
          if (matchedJob) {
            // Create a simulated match on the server
            await apiRequest('POST', '/api/recruiter-interests', {
              userId,
              jobId
            });
            
            onMatchFound(matchedJob);
          }
        }
      }
    } catch (error) {
      toast({
        title: "Swipe failed",
        description: "There was a problem recording your swipe. Please try again.",
        variant: "destructive"
      });
    }
  }, [userId, jobs, onMatchFound, toast]);

  const rejectJob = useCallback(() => {
    if (currentJobs.length === 0) return;
    handleSwipe(currentJobs[0].id, false);
  }, [currentJobs, handleSwipe]);

  const approveJob = useCallback(() => {
    if (currentJobs.length === 0) return;
    handleSwipe(currentJobs[0].id, true);
  }, [currentJobs, handleSwipe]);

  return {
    currentJobs,
    handleSwipe,
    rejectJob,
    approveJob
  };
};
