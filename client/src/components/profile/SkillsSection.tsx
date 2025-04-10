import { useState } from "react";
import { Skill } from "@shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface SkillsSectionProps {
  userId: number;
  skills: Skill[];
  onUpdate: () => void;
}

const skillFormSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
});

type SkillFormValues = z.infer<typeof skillFormSchema>;

const SkillsSection = ({ userId, skills, onUpdate }: SkillsSectionProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<SkillFormValues>({
    resolver: zodResolver(skillFormSchema),
    defaultValues: {
      name: "",
    },
  });
  
  const { handleSubmit, reset, formState: { isSubmitting } } = form;
  
  const openAddDialog = () => {
    reset({ name: "" });
    setIsDialogOpen(true);
  };
  
  const closeDialog = () => {
    setIsDialogOpen(false);
  };
  
  const onSubmit = async (data: SkillFormValues) => {
    // Check if skill already exists
    const skillExists = skills.some(
      (skill) => skill.name.toLowerCase() === data.name.toLowerCase()
    );
    
    if (skillExists) {
      toast({
        title: "Skill already exists",
        description: "This skill is already in your profile.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await apiRequest('POST', `/api/skills`, {
        userId,
        name: data.name,
      });
      
      toast({
        title: "Skill added",
        description: "Your skill has been added successfully.",
        variant: "default",
      });
      
      closeDialog();
      onUpdate();
    } catch (error) {
      toast({
        title: "Add failed",
        description: "Failed to add skill. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleDelete = async (id: number) => {
    try {
      await apiRequest('DELETE', `/api/skills/${id}`, undefined);
      
      toast({
        title: "Skill deleted",
        description: "Your skill has been deleted successfully.",
        variant: "default",
      });
      
      onUpdate();
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Failed to delete skill. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-lg">Skills</h3>
        <button 
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium"
          onClick={openAddDialog}
        >
          <i className="fas fa-plus mr-1"></i> Add Skill
        </button>
      </div>
      
      {skills.length === 0 ? (
        <p className="text-neutral-500 text-center py-4">
          No skills added yet. Click the button above to add your skills.
        </p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {skills.map((skill) => (
            <div 
              key={skill.id}
              className="bg-neutral-100 text-neutral-800 px-3 py-2 rounded-lg flex items-center"
            >
              {skill.name}
              <button 
                className="ml-2 text-neutral-500 hover:text-red-500"
                onClick={() => handleDelete(skill.id)}
              >
                <i className="fas fa-times text-xs"></i>
              </button>
            </div>
          ))}
        </div>
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Skill</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skill Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. JavaScript, Project Management, etc." />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Adding...' : 'Add Skill'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SkillsSection;
