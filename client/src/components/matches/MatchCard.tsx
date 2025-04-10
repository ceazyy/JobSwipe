import { Job } from "@shared/schema";

export interface MatchWithJob {
  id: number;
  userId: number;
  jobId: number;
  status: string;
  createdAt: Date;
  job: Job;
}

interface MatchCardProps {
  match: MatchWithJob;
}

const MatchCard = ({ match }: MatchCardProps) => {
  const { job, createdAt } = match;
  const matchDate = new Date(createdAt);
  const daysAgo = Math.floor((Date.now() - matchDate.getTime()) / (1000 * 60 * 60 * 24));
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-primary relative">
      <div className="absolute -top-2 -right-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
        New Match
      </div>
      <div className="flex items-start">
        <div className="w-12 h-12 rounded-lg mr-4 overflow-hidden bg-gray-200">
          {job.companyImage ? (
            <img 
              src={job.companyImage} 
              alt={`${job.company} logo`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
              <i className="fas fa-building"></i>
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{job.title}</h3>
              <p className="text-neutral-600">{job.company}</p>
            </div>
            <span className="text-sm text-neutral-500">
              Matched {daysAgo === 0 ? 'today' : daysAgo === 1 ? 'yesterday' : `${daysAgo} days ago`}
            </span>
          </div>
          <div className="flex items-center mt-2 text-sm">
            {job.location && (
              <span className="text-neutral-500 mr-3">
                <i className="fas fa-map-marker-alt mr-1"></i> {job.location}
              </span>
            )}
            {job.salary && (
              <span className="text-neutral-500">
                <i className="fas fa-dollar-sign mr-1"></i> {job.salary}
              </span>
            )}
          </div>
          <p className="mt-3 text-neutral-600 text-sm">
            You both showed interest in this position. The hiring manager has viewed your profile and wants to connect.
          </p>
          <div className="mt-4 flex space-x-3">
            <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium">
              Send Message
            </button>
            <button className="bg-white hover:bg-neutral-100 text-primary border border-primary px-4 py-2 rounded-lg text-sm font-medium">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;
