import { User } from "@shared/schema";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ProfileHeaderProps {
  user: User;
  onUpdate: () => void;
}

const ProfileHeader = ({ user, onUpdate }: ProfileHeaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Simple validation
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file.",
          variant: "destructive"
        });
        return;
      }
      
      // Create a data URL for immediate display
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target && event.target.result) {
          try {
            setIsUploading(true);
            
            // In a real app, we'd upload the file to a server
            // Here we'll just update the user with the data URL
            await apiRequest('PATCH', `/api/users/${user.id}`, {
              profileImage: event.target.result
            });
            
            onUpdate();
            
            toast({
              title: "Profile updated",
              description: "Your profile image has been updated successfully.",
              variant: "default"
            });
          } catch (error) {
            toast({
              title: "Update failed",
              description: "Failed to update profile image. Please try again.",
              variant: "destructive"
            });
          } finally {
            setIsUploading(false);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <div className="flex flex-col md:flex-row items-center md:items-start">
        <div className="mb-4 md:mb-0 md:mr-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-sm">
              {user.profileImage ? (
                <img 
                  src={user.profileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                  <i className="fas fa-user text-primary text-2xl"></i>
                </div>
              )}
            </div>
            <label className="absolute bottom-0 right-0 bg-primary hover:bg-primary/90 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-sm cursor-pointer">
              <input 
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={handleProfileImageChange}
                disabled={isUploading}
              />
              <i className="fas fa-camera text-sm"></i>
            </label>
          </div>
        </div>
        <div className="text-center md:text-left flex-1">
          <h3 className="text-xl font-semibold">
            {user.firstName} {user.lastName}
          </h3>
          <p className="text-neutral-600 mb-2">{user.title}</p>
          {user.location && (
            <p className="text-neutral-500 text-sm mb-4">
              <i className="fas fa-map-marker-alt mr-1"></i> {user.location}
            </p>
          )}
          <div className="flex flex-wrap justify-center md:justify-start gap-2">
            <span className="bg-neutral-100 text-neutral-800 text-xs px-3 py-1 rounded-full">Figma</span>
            <span className="bg-neutral-100 text-neutral-800 text-xs px-3 py-1 rounded-full">User Research</span>
            <span className="bg-neutral-100 text-neutral-800 text-xs px-3 py-1 rounded-full">Prototyping</span>
            <span className="bg-neutral-100 text-neutral-800 text-xs px-3 py-1 rounded-full">HTML/CSS</span>
            <span className="bg-neutral-100 text-neutral-800 text-xs px-3 py-1 rounded-full">JavaScript</span>
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          <button className="bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-700 px-4 py-2 rounded-lg text-sm font-medium">
            <i className="fas fa-cog mr-1"></i> Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
