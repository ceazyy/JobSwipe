import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MatchCard from "@/components/matches/MatchCard";
import { MatchWithJob } from "@/components/matches/MatchCard";

type MatchStatus = "new" | "in_process" | "interview" | "offer";

const Matches = () => {
  const [activeTab, setActiveTab] = useState<MatchStatus>("new");
  
  // For demo purposes, we'll use user id 1 (the demo user)
  const userId = 1;
  
  const { data: matches = [], isLoading } = useQuery<MatchWithJob[]>({
    queryKey: ['/api/users', userId, 'matches', { status: activeTab }],
  });
  
  const handleTabChange = (status: MatchStatus) => {
    setActiveTab(status);
  };
  
  // Helper to get tab counts (real app would get this from API)
  const getTabCount = (status: MatchStatus): number => {
    if (status === 'new') return 3;
    if (status === 'in_process') return 2;
    if (status === 'interview') return 1;
    return 0;
  };
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <h2 className="text-2xl font-bold mb-6">Your Matches</h2>
      
      {/* Tabs for match stages */}
      <div className="border-b border-neutral-200 mb-6">
        <div className="flex overflow-x-auto hide-scrollbar">
          <button 
            className={`px-5 py-3 font-medium ${activeTab === 'new' ? 'text-primary border-b-2 border-primary' : 'text-neutral-500 hover:text-neutral-900'}`}
            onClick={() => handleTabChange('new')}
          >
            New Matches ({getTabCount('new')})
          </button>
          <button 
            className={`px-5 py-3 font-medium ${activeTab === 'in_process' ? 'text-primary border-b-2 border-primary' : 'text-neutral-500 hover:text-neutral-900'}`}
            onClick={() => handleTabChange('in_process')}
          >
            In Process ({getTabCount('in_process')})
          </button>
          <button 
            className={`px-5 py-3 font-medium ${activeTab === 'interview' ? 'text-primary border-b-2 border-primary' : 'text-neutral-500 hover:text-neutral-900'}`}
            onClick={() => handleTabChange('interview')}
          >
            Interviews ({getTabCount('interview')})
          </button>
          <button 
            className={`px-5 py-3 font-medium ${activeTab === 'offer' ? 'text-primary border-b-2 border-primary' : 'text-neutral-500 hover:text-neutral-900'}`}
            onClick={() => handleTabChange('offer')}
          >
            Offers ({getTabCount('offer')})
          </button>
        </div>
      </div>
      
      {/* Match Cards */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-600">Loading matches...</p>
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm p-6">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-search text-neutral-400 text-2xl"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">No matches found</h3>
            <p className="text-neutral-600 mb-4">
              {activeTab === 'new' 
                ? "You don't have any new matches yet. Start swiping to find your perfect job match!"
                : `You don't have any matches in the ${activeTab.replace('_', ' ')} stage.`}
            </p>
            {activeTab === 'new' && (
              <a href="/swipe" className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium inline-block">
                Start Swiping
              </a>
            )}
          </div>
        ) : (
          matches.map(match => (
            <MatchCard key={match.id} match={match} />
          ))
        )}
      </div>
    </div>
  );
};

export default Matches;
