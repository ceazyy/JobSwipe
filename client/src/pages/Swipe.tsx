import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Job } from "@shared/schema";
import JobCard from "@/components/jobs/JobCard";
import SwipeControls from "@/components/jobs/SwipeControls";
import MatchNotification from "@/components/matches/MatchNotification";
import { useSwipe } from "@/hooks/useSwipe";

const Swipe = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [matchedJob, setMatchedJob] = useState<Job | null>(null);
  const [showMatchNotification, setShowMatchNotification] = useState(false);
  
  // For demo purposes, we'll use user id 1 (the demo user)
  const userId = 1;
  
  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ['/api/jobs'],
  });
  
  const { currentJobs, handleSwipe, rejectJob, approveJob } = useSwipe({
    userId,
    jobs,
    onMatchFound: (job) => {
      setMatchedJob(job);
      setShowMatchNotification(true);
    }
  });
  
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };
  
  const closeMatchNotification = () => {
    setShowMatchNotification(false);
  };
  
  const handleSendMessage = () => {
    // In a real app, this would navigate to a messaging interface
    setShowMatchNotification(false);
  };
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Find Jobs</h2>
        <button 
          className="text-neutral-500 hover:text-primary"
          onClick={toggleFilter}
          aria-label="Filter jobs"
        >
          <i className="fas fa-sliders-h text-xl"></i>
        </button>
      </div>
      
      {/* Filter dropdown */}
      {isFilterOpen && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h3 className="font-semibold mb-3">Filter Jobs</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Job Type</label>
              <select className="w-full p-2 border border-neutral-300 rounded-md">
                <option>All Types</option>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Remote</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Experience Level</label>
              <select className="w-full p-2 border border-neutral-300 rounded-md">
                <option>All Levels</option>
                <option>Entry Level</option>
                <option>Mid Level</option>
                <option>Senior</option>
                <option>Executive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Salary Range</label>
              <select className="w-full p-2 border border-neutral-300 rounded-md">
                <option>Any Salary</option>
                <option>$30k - $50k</option>
                <option>$50k - $75k</option>
                <option>$75k - $100k</option>
                <option>$100k+</option>
              </select>
            </div>
            <div className="flex justify-end">
              <button className="bg-primary hover:bg-primary/90 text-white font-medium px-4 py-2 rounded-md">
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Swipe Cards Container */}
      <div className="relative h-[450px] flex items-center justify-center">
        {isLoading ? (
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-600">Loading jobs...</p>
          </div>
        ) : currentJobs.length === 0 ? (
          <div className="text-center bg-white rounded-xl shadow-lg p-6 max-w-[400px]">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-check-circle text-primary text-2xl"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">All caught up!</h3>
            <p className="text-neutral-600 mb-4">You've viewed all available jobs. Check back later for new opportunities.</p>
            <button 
              className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium"
              onClick={() => window.location.reload()}
            >
              Refresh Jobs
            </button>
          </div>
        ) : (
          currentJobs.map((job, index) => (
            <JobCard 
              key={job.id} 
              job={job} 
              index={index} 
              onSwipe={handleSwipe}
              style={{
                zIndex: currentJobs.length - index,
                transform: index === 0 
                  ? 'scale(1) translateY(0)' 
                  : `scale(${1 - index * 0.05}) translateY(-${index * 10}px)`
              }}
            />
          ))
        )}
      </div>
      
      {/* Swipe Actions */}
      {currentJobs.length > 0 && (
        <SwipeControls onReject={rejectJob} onApprove={approveJob} />
      )}
      
      {/* Match Notification */}
      <MatchNotification 
        isVisible={showMatchNotification} 
        job={matchedJob} 
        onClose={closeMatchNotification}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default Swipe;
