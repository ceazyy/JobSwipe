import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ResumeUploaderProps {
  userId: number;
  onUploadSuccess: () => void;
}

const ResumeUploader = ({ userId, onUploadSuccess }: ResumeUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFile(e.target.files[0]);
    }
  };

  const uploadFile = async (file: File) => {
    // Check file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/rtf'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, DOC, DOCX, or RTF file.",
        variant: "destructive"
      });
      return;
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "File size should not exceed 5MB.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('resume', file);
      
      const response = await fetch(`/api/users/${userId}/resume`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      toast({
        title: "Resume uploaded",
        description: "Your resume has been successfully uploaded.",
        variant: "default"
      });
      
      onUploadSuccess();
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="font-semibold text-lg mb-4">Upload New Resume</h3>
      
      <div 
        className={`border-2 border-dashed ${isDragging ? 'border-primary bg-primary/5' : 'border-neutral-300 bg-neutral-50'} rounded-lg p-8 text-center mb-6`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="mb-4">
          <i className="fas fa-cloud-upload-alt text-neutral-400 text-4xl"></i>
        </div>
        <p className="text-neutral-600 mb-2">Drag and drop your resume file here, or</p>
        <label className="inline-block">
          <input 
            type="file" 
            className="hidden" 
            accept=".pdf,.doc,.docx,.rtf"
            onChange={handleFileChange}
            disabled={isUploading} 
          />
          <span className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer inline-block">
            {isUploading ? 'Uploading...' : 'Browse Files'}
          </span>
        </label>
        <p className="text-neutral-500 text-sm mt-2">Supported formats: PDF, DOCX, RTF (Max 5MB)</p>
      </div>
      
      <div className="border-t border-neutral-200 pt-4">
        <h4 className="font-medium mb-3">Resume Tips</h4>
        <ul className="text-neutral-600 text-sm space-y-2">
          <li><i className="fas fa-check-circle text-green-500 mr-2"></i> Keep your resume concise and focused on relevant experience</li>
          <li><i className="fas fa-check-circle text-green-500 mr-2"></i> Use keywords from job descriptions to optimize for ATS systems</li>
          <li><i className="fas fa-check-circle text-green-500 mr-2"></i> Quantify your achievements with specific metrics when possible</li>
          <li><i className="fas fa-check-circle text-green-500 mr-2"></i> Ensure your contact information is current and professional</li>
        </ul>
      </div>
    </div>
  );
};

export default ResumeUploader;
