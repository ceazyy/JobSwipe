import { Job } from "@shared/schema";
import { motion } from "framer-motion";
import { useState } from "react";

interface JobCardProps {
  job: Job;
  index: number;
  onSwipe: (jobId: number, liked: boolean) => void;
  style?: React.CSSProperties;
}

const JobCard = ({ job, index, onSwipe, style }: JobCardProps) => {
  const [swipeDirection, setSwipeDirection] = useState<null | "left" | "right">(null);
  
  const handleSwipe = (direction: "left" | "right") => {
    setSwipeDirection(direction);
    setTimeout(() => {
      onSwipe(job.id, direction === "right");
    }, 300);
  };

  // Parse requirements into array if it's a string
  const requirementsList = typeof job.requirements === 'string' 
    ? job.requirements.split('\n') 
    : [];

  return (
    <motion.div
      className="absolute bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-[400px] h-[450px]"
      style={{
        zIndex: 1000 - index,
        ...style
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={(e, { offset }) => {
        if (offset.x > 100) {
          handleSwipe("right");
        } else if (offset.x < -100) {
          handleSwipe("left");
        }
      }}
      animate={
        swipeDirection === "left" 
          ? { x: -1000, rotate: -30, transition: { duration: 0.5 } }
          : swipeDirection === "right" 
            ? { x: 1000, rotate: 30, transition: { duration: 0.5 } } 
            : {}
      }
    >
      <div 
        className="h-36 bg-gradient-to-r from-blue-500 to-purple-600 relative"
      >
        {job.companyBackground && (
          <div 
            className="w-full h-full bg-center bg-cover mix-blend-overlay"
            style={{ backgroundImage: `url(${job.companyBackground})` }}
          />
        )}
        <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
          <div className="font-bold text-xl">{job.title}</div>
          <div>{job.company}</div>
        </div>
      </div>
      <div className="p-4 overflow-y-auto h-[calc(100%-9rem)]">
        <div className="flex items-center mb-3">
          {job.jobType && (
            <div className="bg-neutral-100 rounded-full px-3 py-1 text-sm font-medium text-neutral-700 mr-2">
              {job.jobType}
            </div>
          )}
          {job.remote && (
            <div className="bg-neutral-100 rounded-full px-3 py-1 text-sm font-medium text-neutral-700">
              Remote
            </div>
          )}
        </div>
        {job.salary && (
          <div className="font-medium text-green-600 mb-3">{job.salary}</div>
        )}
        <p className="text-neutral-600 mb-3">{job.description}</p>
        
        {requirementsList.length > 0 && (
          <>
            <h4 className="font-semibold mb-2">Requirements:</h4>
            <ul className="text-neutral-600 mb-3 list-disc pl-5 space-y-1">
              {requirementsList.map((req, idx) => (
                <li key={idx}>{req}</li>
              ))}
            </ul>
          </>
        )}
        
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-neutral-500">
            Posted {job.postedAt ? new Date(job.postedAt).toLocaleDateString() : 'recently'}
          </div>
          {job.location && (
            <div className="text-sm text-neutral-500">{job.location}</div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default JobCard;
