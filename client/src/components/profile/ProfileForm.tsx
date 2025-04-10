import { useState } from "react";
import { User } from "@shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ProfileFormProps {
  user: User;
  onUpdate: () => void;
}

const profileFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  title: z.string().optional(),
  location: z.string().optional(),
  about: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const ProfileForm = ({ user, onUpdate }: ProfileFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phone: user.phone || "",
      title: user.title || "",
      location: user.location || "",
      about: user.about || "",
    },
  });
  
  const { handleSubmit, formState: { isSubmitting } } = form;
  
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };
  
  const onSubmit = async (data: ProfileFormValues) => {
    try {
      await apiRequest('PATCH', `/api/users/${user.id}`, data);
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
        variant: "default",
      });
      
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update profile information. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-lg">Personal Information</h3>
        <button 
          className="text-primary hover:text-primary/80 text-sm font-medium"
          onClick={toggleEdit}
        >
          <i className={`fas ${isEditing ? 'fa-times' : 'fa-pen'} mr-1`}></i> 
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>
      
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-neutral-700">First Name</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      disabled={!isEditing}
                      className="w-full p-2 border border-neutral-300 rounded-md"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-neutral-700">Last Name</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      disabled={!isEditing}
                      className="w-full p-2 border border-neutral-300 rounded-md"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-neutral-700">Email</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="email"
                      disabled={!isEditing}
                      className="w-full p-2 border border-neutral-300 rounded-md"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-neutral-700">Phone</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="tel"
                      disabled={!isEditing}
                      className="w-full p-2 border border-neutral-300 rounded-md"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="text-sm font-medium text-neutral-700">Professional Title</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      disabled={!isEditing}
                      className="w-full p-2 border border-neutral-300 rounded-md"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="text-sm font-medium text-neutral-700">Location</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      disabled={!isEditing}
                      className="w-full p-2 border border-neutral-300 rounded-md"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="about"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="text-sm font-medium text-neutral-700">About</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      disabled={!isEditing}
                      rows={4}
                      className="w-full p-2 border border-neutral-300 rounded-md"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          
          {isEditing && (
            <div className="flex justify-end">
              <Button 
                type="submit" 
                className="bg-primary hover:bg-primary/90 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};

export default ProfileForm;
