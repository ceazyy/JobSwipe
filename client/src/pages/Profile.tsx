import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { User, WorkExperience, Education, Skill } from "@shared/schema";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileForm from "@/components/profile/ProfileForm";
import ExperienceSection from "@/components/profile/ExperienceSection";
import EducationSection from "@/components/profile/EducationSection";
import SkillsSection from "@/components/profile/SkillsSection";

const Profile = () => {
  // For demo purposes, we'll use user id 1 (the demo user)
  const userId = 1;
  const queryClient = useQueryClient();
  
  const { data: user, isLoading: isUserLoading } = useQuery<User>({
    queryKey: [`/api/users/${userId}`],
  });
  
  const { data: workExperiences = [], isLoading: isExperiencesLoading } = useQuery<WorkExperience[]>({
    queryKey: [`/api/users/${userId}/work-experiences`],
  });
  
  const { data: educations = [], isLoading: isEducationsLoading } = useQuery<Education[]>({
    queryKey: [`/api/users/${userId}/educations`],
  });
  
  const { data: skills = [], isLoading: isSkillsLoading } = useQuery<Skill[]>({
    queryKey: [`/api/users/${userId}/skills`],
  });
  
  const isLoading = isUserLoading || isExperiencesLoading || isEducationsLoading || isSkillsLoading;
  
  const handleDataUpdate = () => {
    // Invalidate all user-related queries to refresh the data
    queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}`] });
    queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/work-experiences`] });
    queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/educations`] });
    queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/skills`] });
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-neutral-600">Loading profile data...</p>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="bg-red-100 text-red-800 p-4 rounded-lg inline-block">
          <p>User not found. Please log in again.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <h2 className="text-2xl font-bold mb-6">Your Profile</h2>
      
      <ProfileHeader user={user} onUpdate={handleDataUpdate} />
      <ProfileForm user={user} onUpdate={handleDataUpdate} />
      <ExperienceSection 
        userId={userId} 
        experiences={workExperiences} 
        onUpdate={handleDataUpdate} 
      />
      <EducationSection 
        userId={userId} 
        educations={educations} 
        onUpdate={handleDataUpdate} 
      />
      <SkillsSection 
        userId={userId} 
        skills={skills} 
        onUpdate={handleDataUpdate} 
      />
    </div>
  );
};

export default Profile;
