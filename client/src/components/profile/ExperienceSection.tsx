import { useState } from "react";
import { WorkExperience } from "@shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface ExperienceSectionProps {
  userId: number;
  experiences: WorkExperience[];
  onUpdate: () => void;
}

const experienceFormSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  company: z.string().min(1, "Company name is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  description: z.string().optional(),
});

type ExperienceFormValues = z.infer<typeof experienceFormSchema>;

const ExperienceSection = ({ userId, experiences, onUpdate }: ExperienceSectionProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<WorkExperience | null>(null);
  const { toast } = useToast();
  
  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceFormSchema),
    defaultValues: {
      title: "",
      company: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    },
  });
  
  const { handleSubmit, reset, watch, setValue, formState: { isSubmitting } } = form;
  const isCurrent = watch("current");
  
  const openAddDialog = () => {
    reset({
      title: "",
      company: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    });
    setEditingExperience(null);
    setIsDialogOpen(true);
  };
  
  const openEditDialog = (experience: WorkExperience) => {
    reset({
      title: experience.title,
      company: experience.company,
      startDate: experience.startDate,
      endDate: experience.endDate || "",
      current: experience.current || false,
      description: experience.description || "",
    });
    setEditingExperience(experience);
    setIsDialogOpen(true);
  };
  
  const closeDialog = () => {
    setIsDialogOpen(false);
  };
  
  const onSubmit = async (data: ExperienceFormValues) => {
    try {
      if (editingExperience) {
        // Update existing experience
        await apiRequest('PATCH', `/api/work-experiences/${editingExperience.id}`, data);
        toast({
          title: "Experience updated",
          description: "Your work experience has been updated successfully.",
          variant: "default",
        });
      } else {
        // Create new experience
        await apiRequest('POST', `/api/work-experiences`, {
          ...data,
          userId,
        });
        toast({
          title: "Experience added",
          description: "Your work experience has been added successfully.",
          variant: "default",
        });
      }
      
      closeDialog();
      onUpdate();
    } catch (error) {
      toast({
        title: "Action failed",
        description: editingExperience
          ? "Failed to update work experience. Please try again."
          : "Failed to add work experience. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this work experience?")) {
      return;
    }
    
    try {
      await apiRequest('DELETE', `/api/work-experiences/${id}`, undefined);
      
      toast({
        title: "Experience deleted",
        description: "Your work experience has been deleted successfully.",
        variant: "default",
      });
      
      onUpdate();
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Failed to delete work experience. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-lg">Work Experience</h3>
        <button 
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium"
          onClick={openAddDialog}
        >
          <i className="fas fa-plus mr-1"></i> Add Experience
        </button>
      </div>
      
      <div className="space-y-6">
        {experiences.length === 0 ? (
          <p className="text-neutral-500 text-center py-4">
            No work experience added yet. Click the button above to add your work history.
          </p>
        ) : (
          experiences.map((experience) => (
            <div key={experience.id} className="border-b border-neutral-200 pb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{experience.title}</h4>
                  <p className="text-neutral-600">{experience.company}</p>
                  <p className="text-neutral-500 text-sm">
                    {experience.startDate} - {experience.current ? 'Present' : experience.endDate}
                    {' • '}
                    {calculateDuration(experience.startDate, experience.current ? undefined : experience.endDate)}
                  </p>
                </div>
                <div>
                  <button 
                    className="text-neutral-500 hover:text-primary p-2"
                    onClick={() => openEditDialog(experience)}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button 
                    className="text-neutral-500 hover:text-red-500 p-2"
                    onClick={() => handleDelete(experience.id)}
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
              {experience.description && (
                <p className="mt-3 text-neutral-600 text-sm">{experience.description}</p>
              )}
            </div>
          ))
        )}
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingExperience ? 'Edit Work Experience' : 'Add Work Experience'}
            </DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. Software Engineer" />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. Acme Corporation" />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. Jan 2020" />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="current"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          if (checked) {
                            setValue('endDate', '');
                          }
                        }}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>I currently work here</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              
              {!isCurrent && (
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. Dec 2022" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Describe your responsibilities and achievements"
                        rows={4}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : editingExperience ? 'Update' : 'Add'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Helper function to calculate duration
function calculateDuration(startDate: string, endDate?: string): string {
  // This is a simplified calculation for display purposes
  // In a real app, you'd use a date library like date-fns
  
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  
  // Simple calculation of difference in years and months
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  
  if (months < 0) {
    years--;
    months += 12;
  }
  
  if (years === 0) {
    return months === 1 ? '1 month' : `${months} months`;
  } else if (months === 0) {
    return years === 1 ? '1 year' : `${years} years`;
  } else {
    return `${years} year${years > 1 ? 's' : ''} ${months} month${months > 1 ? 's' : ''}`;
  }
}

export default ExperienceSection;
