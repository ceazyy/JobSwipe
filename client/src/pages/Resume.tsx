import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ResumeUploader from "@/components/resume/ResumeUploader";
import { formatDistanceToNow } from "date-fns";

const Resume = () => {
  // For demo purposes, we'll use user id 1 (the demo user)
  const userId = 1;
  const queryClient = useQueryClient();
  
  const { data: user, isLoading } = useQuery({
    queryKey: [`/api/users/${userId}`],
  });
  
  const handleResumeUploadSuccess = () => {
    // Invalidate the user query to refresh the data
    queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}`] });
  };
  
  const handleResumeDelete = async () => {
    if (!confirm("Are you sure you want to delete your resume?")) {
      return;
    }
    
    try {
      // In a real app, we'd have a specific API endpoint for deleting the resume
      // Here we'll just clear the resumePath field
      await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumePath: null, resumeUpdatedAt: null }),
        credentials: 'include'
      });
      
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}`] });
    } catch (error) {
      console.error("Failed to delete resume:", error);
    }
  };
  
  const formatUpdatedDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Never";
    
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (e) {
      return "Unknown date";
    }
  };
  
  const getResumeFilename = (path: string | null | undefined) => {
    if (!path) return "";
    
    // Extract filename from path
    const parts = path.split('/');
    return parts[parts.length - 1];
  };
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Your Resume</h2>
      
      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading...</p>
        </div>
      ) : (
        <>
          {/* Current Resume Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-lg">Current Resume</h3>
              <div className="text-sm text-neutral-500">
                Last updated: {formatUpdatedDate(user?.resumeUpdatedAt)}
              </div>
            </div>
            
            {user?.resumePath ? (
              <div className="border border-neutral-200 rounded-lg p-4 flex items-center justify-between bg-neutral-50">
                <div className="flex items-center">
                  <div className="bg-primary/10 rounded-lg p-3 mr-4">
                    <i className="fas fa-file-pdf text-primary text-xl"></i>
                  </div>
                  <div>
                    <div className="font-medium">{getResumeFilename(user.resumePath)}</div>
                    <div className="text-neutral-500 text-sm">Uploaded {formatUpdatedDate(user.resumeUpdatedAt)}</div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    className="text-neutral-700 hover:text-primary p-2"
                    aria-label="Download resume"
                  >
                    <i className="fas fa-download"></i>
                  </button>
                  <button 
                    className="text-neutral-700 hover:text-primary p-2"
                    aria-label="View resume"
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                  <button 
                    className="text-neutral-700 hover:text-red-500 p-2"
                    onClick={handleResumeDelete}
                    aria-label="Delete resume"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            ) : (
              <div className="border border-dashed border-neutral-300 rounded-lg p-6 text-center bg-neutral-50">
                <div className="mb-4">
                  <i className="fas fa-file-upload text-neutral-400 text-3xl"></i>
                </div>
                <h4 className="font-medium text-lg mb-2">No Resume Uploaded</h4>
                <p className="text-neutral-500 mb-4">
                  Upload your resume to increase your chances of getting matched with great job opportunities.
                </p>
              </div>
            )}
          </div>
          
          {/* Upload New Resume Section */}
          <ResumeUploader userId={userId} onUploadSuccess={handleResumeUploadSuccess} />
        </>
      )}
    </div>
  );
};

export default Resume;
