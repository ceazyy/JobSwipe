import { useState } from "react";
import { Job } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useAIServices } from "@/hooks/use-ai-services";
import { ChevronDown, ChevronUp, Lightbulb, AlertCircle, CheckCircle2, Award } from "lucide-react";

interface JobMatchInfoProps {
  job: Job;
}

const JobMatchInfo = ({ job }: JobMatchInfoProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const { useJobMatch } = useAIServices();
  
  const { 
    data: matchData, 
    isLoading, 
    isError,
    refetch
  } = useJobMatch(job.id);
  
  if (isLoading) {
    return (
      <Card className="w-full mt-4">
        <CardContent className="pt-6 pb-4 text-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Analyzing job match...</p>
        </CardContent>
      </Card>
    );
  }
  
  if (isError) {
    return (
      <Card className="w-full mt-4 border-red-200">
        <CardContent className="pt-6 pb-4">
          <div className="flex items-center gap-2 text-red-500 mb-2">
            <AlertCircle size={18} />
            <p className="font-semibold">Analysis failed</p>
          </div>
          <p className="text-neutral-600 text-sm">Unable to analyze job match at this time.</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  if (!matchData) {
    return (
      <Card className="w-full mt-4">
        <CardContent className="pt-6 pb-4 text-center">
          <Button variant="default" onClick={() => refetch()}>
            Analyze Job Match
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  // Cast to the expected type
  const jobMatchData = matchData as {
    score: number;
    matchingSummary: string;
    missingSkills: string[];
    recommendedAction: string;
  };
  
  const { score, matchingSummary, missingSkills, recommendedAction } = jobMatchData;
  
  // Determine match level based on score
  let matchLevel = "Low";
  let matchColor = "text-red-500";
  let progressColor = "bg-red-500";
  
  if (score >= 80) {
    matchLevel = "Excellent";
    matchColor = "text-green-600";
    progressColor = "bg-green-600";
  } else if (score >= 60) {
    matchLevel = "Good";
    matchColor = "text-blue-500";
    progressColor = "bg-blue-500";
  } else if (score >= 40) {
    matchLevel = "Average";
    matchColor = "text-yellow-500";
    progressColor = "bg-yellow-500";
  }
  
  return (
    <Card className="w-full mt-4">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Match Analysis</CardTitle>
          <span className={`font-bold ${matchColor}`}>{matchLevel}</span>
        </div>
        <CardDescription>
          How well your profile matches this job
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-3">
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Match Score</span>
            <span className="font-medium">{score}%</span>
          </div>
          <Progress value={score} className={progressColor} />
        </div>
        
        <p className="text-sm text-neutral-700 mb-4">{matchingSummary}</p>
        
        {showDetails && (
          <>
            <Separator className="my-4" />
            
            <div className="space-y-4">
              {missingSkills.length > 0 && (
                <div>
                  <h4 className="font-medium flex items-center gap-1 mb-2">
                    <Lightbulb size={16} className="text-yellow-500" />
                    <span>Skills to Develop</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {missingSkills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <h4 className="font-medium flex items-center gap-1 mb-2">
                  <CheckCircle2 size={16} className="text-green-500" />
                  <span>Recommended Action</span>
                </h4>
                <p className="text-sm text-neutral-700">{recommendedAction}</p>
              </div>
            </div>
          </>
        )}
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full flex items-center justify-center gap-1"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? (
            <>
              <span>Show Less</span>
              <ChevronUp size={16} />
            </>
          ) : (
            <>
              <span>Show More</span>
              <ChevronDown size={16} />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JobMatchInfo;