import { useState } from "react";
import { Plus, X, Target, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Achievement {
  id: string;
  text: string;
}

interface Goal {
  id: string;
  title: string;
  achievements: Achievement[];
}

const GoalsCard = () => {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "1",
      title: "Assist in streamlining the NextGen onboarding process.",
      achievements: [
        { id: "1-1", text: "Worked with PMO on defining a new base set of features to roll out by industry." },
        { id: "1-2", text: "Worked with Product to build and refine the Business and Technical requirements documents for the Pre-Sales process." },
        { id: "1-3", text: "Worked with PMO on defining best practices in onboarding timeline" },
      ]
    },
    {
      id: "2", 
      title: "Upgrade the Demo site with the latest features and experiences",
      achievements: [
        { id: "2-1", text: "Worked with Skinning and marketing to redo the site home page." },
        { id: "2-2", text: "Defined process with Product to now deploy new new features to the Demo site once they are production ready." },
      ]
    },
    {
      id: "3",
      title: "Hire another Solutions Consultant", 
      achievements: [
        { id: "3-1", text: "Reviewed and updates the \"Director - SE\" role job description and submitted to leadership in June 2025." },
      ]
    },
    {
      id: "4",
      title: "Other Achievements",
      achievements: [
        { id: "4-1", text: "Worked with Partnership team and Tech to build out the Salesforce PRM integration process." },
      ]
    },
  ]);
  
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [isAchievementDialogOpen, setIsAchievementDialogOpen] = useState(false);
  const [newGoal, setNewGoal] = useState("");
  const [newAchievement, setNewAchievement] = useState("");
  const [selectedGoalId, setSelectedGoalId] = useState("");
  const { toast } = useToast();

  const handleAddGoal = () => {
    if (!newGoal.trim()) return;
    
    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.trim(),
      achievements: []
    };
    
    setGoals(prev => [...prev, goal]);
    setNewGoal("");
    setIsGoalDialogOpen(false);
    
    toast({
      description: "Goal added successfully",
      duration: 2000,
    });
  };

  const handleAddAchievement = () => {
    if (!newAchievement.trim() || !selectedGoalId) return;
    
    const achievement: Achievement = {
      id: `${selectedGoalId}-${Date.now()}`,
      text: newAchievement.trim()
    };
    
    setGoals(prev => prev.map(goal => 
      goal.id === selectedGoalId 
        ? { ...goal, achievements: [...goal.achievements, achievement] }
        : goal
    ));
    
    setNewAchievement("");
    setIsAchievementDialogOpen(false);
    setSelectedGoalId("");
    
    toast({
      description: "Achievement added successfully",
      duration: 2000,
    });
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId));
    toast({
      description: "Goal removed",
      duration: 2000,
    });
  };

  const handleDeleteAchievement = (goalId: string, achievementId: string) => {
    setGoals(prev => prev.map(goal =>
      goal.id === goalId
        ? { ...goal, achievements: goal.achievements.filter(a => a.id !== achievementId) }
        : goal
    ));
    toast({
      description: "Achievement removed",
      duration: 2000,
    });
  };

  const totalAchievements = goals.reduce((sum, goal) => sum + goal.achievements.length, 0);

  return (
    <div className="dashboard-card p-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-accent/20 to-primary/10 rounded-xl flex items-center justify-center">
            <Target className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Goals</h2>
            <p className="text-sm text-muted">
              {goals.length} goals • {totalAchievements} achievements
            </p>
          </div>
        </div>
        
        <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="goal">Goal Title</Label>
                <Input
                  id="goal"
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  placeholder="Enter your goal..."
                  className="input-field"
                />
              </div>
              <Button onClick={handleAddGoal} className="btn-primary w-full">
                Create Goal
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Goals List */}
      <div className="space-y-6 max-h-96 overflow-y-auto">
        {goals.map((goal, goalIndex) => (
          <div 
            key={goal.id}
            className="bg-surface/50 border border-border/20 rounded-2xl p-4 animate-fade-in"
            style={{ animationDelay: `${goalIndex * 0.1}s` }}
          >
            {/* Goal Header */}
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-semibold text-foreground pr-4">{goal.title}</h3>
              <button
                onClick={() => handleDeleteGoal(goal.id)}
                className="btn-ghost p-1 opacity-50 hover:opacity-100"
              >
                <X className="w-4 h-4 text-danger" />
              </button>
            </div>

            {/* Add Achievement Button */}
            <Dialog open={isAchievementDialogOpen && selectedGoalId === goal.id} onOpenChange={(open) => {
              setIsAchievementDialogOpen(open);
              if (open) setSelectedGoalId(goal.id);
              else setSelectedGoalId("");
            }}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mb-4 border-border/40 hover:border-accent/50"
                  onClick={() => setSelectedGoalId(goal.id)}
                >
                  <Plus className="w-3 h-3 mr-2" />
                  Add Achievement
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Achievement</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="achievement">Achievement Description</Label>
                    <Input
                      id="achievement"
                      value={newAchievement}
                      onChange={(e) => setNewAchievement(e.target.value)}
                      placeholder="Describe your achievement..."
                      className="input-field"
                    />
                  </div>
                  <Button onClick={handleAddAchievement} className="btn-primary w-full">
                    Add Achievement
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Achievements List */}
            <div className="space-y-3">
              {goal.achievements.map((achievement, achIndex) => (
                <div 
                  key={achievement.id}
                  className="flex items-start gap-3 p-3 bg-background/50 rounded-xl border border-border/10 group animate-fade-in"
                  style={{ animationDelay: `${(goalIndex * 0.1) + (achIndex * 0.05)}s` }}
                >
                  <div className="w-5 h-5 bg-accent/20 rounded-full flex items-center justify-center mt-0.5">
                    <Award className="w-3 h-3 text-accent" />
                  </div>
                  <span className="flex-1 text-sm text-foreground">{achievement.text}</span>
                  <button
                    onClick={() => handleDeleteAchievement(goal.id, achievement.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity btn-ghost p-1"
                  >
                    <X className="w-3 h-3 text-danger" />
                  </button>
                </div>
              ))}
              
              {goal.achievements.length === 0 && (
                <div className="text-center py-4 text-muted text-sm opacity-50">
                  No achievements yet
                </div>
              )}
            </div>
          </div>
        ))}
        
        {goals.length === 0 && (
          <div className="text-center py-8 text-muted">
            <Target className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p>No goals yet. Set your first goal!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalsCard;