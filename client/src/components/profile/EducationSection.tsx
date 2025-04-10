import { useState } from "react";
import { Education } from "@shared/schema";
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

interface EducationSectionProps {
  userId: number;
  educations: Education[];
  onUpdate: () => void;
}

const educationFormSchema = z.object({
  degree: z.string().min(1, "Degree is required"),
  institution: z.string().min(1, "Institution is required"),
  startYear: z.string().min(1, "Start year is required"),
  endYear: z.string().optional(),
  description: z.string().optional(),
});

type EducationFormValues = z.infer<typeof educationFormSchema>;

const EducationSection = ({ userId, educations, onUpdate }: EducationSectionProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const { toast } = useToast();
  
  const form = useForm<EducationFormValues>({
    resolver: zodResolver(educationFormSchema),
    defaultValues: {
      degree: "",
      institution: "",
      startYear: "",
      endYear: "",
      description: "",
    },
  });
  
  const { handleSubmit, reset, formState: { isSubmitting } } = form;
  
  const openAddDialog = () => {
    reset({
      degree: "",
      institution: "",
      startYear: "",
      endYear: "",
      description: "",
    });
    setEditingEducation(null);
    setIsDialogOpen(true);
  };
  
  const openEditDialog = (education: Education) => {
    reset({
      degree: education.degree,
      institution: education.institution,
      startYear: education.startYear,
      endYear: education.endYear || "",
      description: education.description || "",
    });
    setEditingEducation(education);
    setIsDialogOpen(true);
  };
  
  const closeDialog = () => {
    setIsDialogOpen(false);
  };
  
  const onSubmit = async (data: EducationFormValues) => {
    try {
      if (editingEducation) {
        // Update existing education
        await apiRequest('PATCH', `/api/educations/${editingEducation.id}`, data);
        toast({
          title: "Education updated",
          description: "Your education has been updated successfully.",
          variant: "default",
        });
      } else {
        // Create new education
        await apiRequest('POST', `/api/educations`, {
          ...data,
          userId,
        });
        toast({
          title: "Education added",
          description: "Your education has been added successfully.",
          variant: "default",
        });
      }
      
      closeDialog();
      onUpdate();
    } catch (error) {
      toast({
        title: "Action failed",
        description: editingEducation
          ? "Failed to update education. Please try again."
          : "Failed to add education. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this education?")) {
      return;
    }
    
    try {
      await apiRequest('DELETE', `/api/educations/${id}`, undefined);
      
      toast({
        title: "Education deleted",
        description: "Your education has been deleted successfully.",
        variant: "default",
      });
      
      onUpdate();
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Failed to delete education. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-lg">Education</h3>
        <button 
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium"
          onClick={openAddDialog}
        >
          <i className="fas fa-plus mr-1"></i> Add Education
        </button>
      </div>
      
      <div className="space-y-6">
        {educations.length === 0 ? (
          <p className="text-neutral-500 text-center py-4">
            No education added yet. Click the button above to add your educational background.
          </p>
        ) : (
          educations.map((education) => (
            <div key={education.id} className="border-b border-neutral-200 pb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{education.degree}</h4>
                  <p className="text-neutral-600">{education.institution}</p>
                  <p className="text-neutral-500 text-sm">
                    {education.startYear} - {education.endYear || 'Present'}
                  </p>
                </div>
                <div>
                  <button 
                    className="text-neutral-500 hover:text-primary p-2"
                    onClick={() => openEditDialog(education)}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button 
                    className="text-neutral-500 hover:text-red-500 p-2"
                    onClick={() => handleDelete(education.id)}
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
              {education.description && (
                <p className="mt-3 text-neutral-600 text-sm">{education.description}</p>
              )}
            </div>
          ))
        )}
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingEducation ? 'Edit Education' : 'Add Education'}
            </DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="degree"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Degree / Certificate</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. Bachelor of Science, Computer Science" />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="institution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institution</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. Stanford University" />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Year</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. 2018" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="endYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Year (or expected)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. 2022" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Describe your studies, achievements, etc."
                        rows={3}
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
                  {isSubmitting ? 'Saving...' : editingEducation ? 'Update' : 'Add'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EducationSection;
