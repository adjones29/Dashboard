import { useState } from "react";
import { ArrowLeft, Plus, Target, Calendar, CheckCircle, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Achievement {
  id: string;
  text: string;
  completed: boolean;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  progress: number;
  achievements: Achievement[];
  status: "active" | "completed" | "archived";
}

const GoalsPage = () => {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "1",
      title: "Assist in streamlining the NextGen onboarding process",
      description: "Work with PMO and Product teams to improve onboarding efficiency",
      targetDate: "2025-12-31",
      progress: 75,
      status: "active",
      achievements: [
        { id: "1-1", text: "Worked with PMO on defining a new base set of features to roll out by industry", completed: true },
        { id: "1-2", text: "Worked with Product to build and refine the Business and Technical requirements documents for the Pre-Sales process", completed: true },
        { id: "1-3", text: "Worked with PMO on defining best practices in onboarding timeline", completed: true },
        { id: "1-4", text: "Implement new onboarding dashboard", completed: false },
      ]
    },
    {
      id: "2", 
      title: "Upgrade the Demo site with the latest features and experiences",
      description: "Enhance demo site to showcase new capabilities",
      targetDate: "2025-10-15",
      progress: 60,
      status: "active",
      achievements: [
        { id: "2-1", text: "Worked with Skinning and marketing to redo the site home page", completed: true },
        { id: "2-2", text: "Defined process with Product to now deploy new features to the Demo site once they are production ready", completed: true },
        { id: "2-3", text: "Add mobile responsive design", completed: false },
      ]
    },
    {
      id: "3",
      title: "Hire another Solutions Consultant", 
      description: "Expand the team with qualified talent",
      targetDate: "2025-11-30",
      progress: 25,
      status: "active",
      achievements: [
        { id: "3-1", text: "Reviewed and updated the \"Director - SE\" role job description and submitted to leadership in June 2025", completed: true },
        { id: "3-2", text: "Post job listing on relevant platforms", completed: false },
        { id: "3-3", text: "Conduct initial interviews", completed: false },
      ]
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "", 
    targetDate: ""
  });
  const { toast } = useToast();

  const handleAddGoal = () => {
    if (!newGoal.title.trim()) return;

    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title.trim(),
      description: newGoal.description.trim(),
      targetDate: newGoal.targetDate,
      progress: 0,
      status: "active",
      achievements: []
    };

    setGoals(prev => [...prev, goal]);
    setNewGoal({ title: "", description: "", targetDate: "" });
    setShowAddForm(false);

    toast({
      description: "Goal added successfully",
      duration: 2000,
    });
  };

  const toggleAchievement = (goalId: string, achievementId: string) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        const updatedAchievements = goal.achievements.map(achievement =>
          achievement.id === achievementId 
            ? { ...achievement, completed: !achievement.completed }
            : achievement
        );
        
        const completedCount = updatedAchievements.filter(a => a.completed).length;
        const progress = updatedAchievements.length > 0 
          ? Math.round((completedCount / updatedAchievements.length) * 100) 
          : 0;
        
        return { ...goal, achievements: updatedAchievements, progress };
      }
      return goal;
    }));
  };

  const addAchievement = (goalId: string, text: string) => {
    if (!text.trim()) return;

    setGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        const newAchievement: Achievement = {
          id: `${goalId}-${Date.now()}`,
          text: text.trim(),
          completed: false
        };
        return { ...goal, achievements: [...goal.achievements, newAchievement] };
      }
      return goal;
    }));
  };

  const activeGoals = goals.filter(g => g.status === "active");
  const completedGoals = goals.filter(g => g.status === "completed");
  const overallProgress = goals.length > 0 
    ? Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg to-bg/80 transition-all duration-500">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-border/40">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => window.location.hash = '#/'}
                className="hover:bg-muted/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold">Goals</h1>
                <p className="text-sm text-muted">Track your progress</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="dashboard-card p-8 mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-primary/10 rounded-2xl flex items-center justify-center">
              <Target className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Goals Dashboard</h2>
              <p className="text-muted">Track your progress towards success</p>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between text-sm text-muted mb-2">
              <span>Overall Progress</span>
              <span>{overallProgress}%</span>
            </div>
            <div className="w-full bg-muted/20 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-accent to-accent/80 h-3 rounded-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-muted mt-2">
              <span>{activeGoals.length} Active Goals</span>
              <span>{completedGoals.length} Completed</span>
            </div>
          </div>
        </div>

        {/* Add Goal Button */}
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-semibold">Active Goals</h3>
          <Button onClick={() => setShowAddForm(true)} className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Goal
          </Button>
        </div>

        {/* Add Goal Form */}
        {showAddForm && (
          <div className="dashboard-card p-6 mb-8">
            <h4 className="text-lg font-semibold mb-4">Add New Goal</h4>
            <div className="space-y-4">
              <Input
                placeholder="Goal title"
                value={newGoal.title}
                onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                className="input-field"
              />
              <Textarea
                placeholder="Goal description (optional)"
                value={newGoal.description}
                onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                className="input-field min-h-[80px]"
              />
              <Input
                type="date"
                value={newGoal.targetDate}
                onChange={(e) => setNewGoal(prev => ({ ...prev, targetDate: e.target.value }))}
                className="input-field"
              />
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleAddGoal} className="btn-primary">
                Add Goal
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowAddForm(false)}
                className="border-border/40"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Goals Grid */}
        <div className="space-y-6">
          {activeGoals.map((goal, index) => (
            <div 
              key={goal.id} 
              className="dashboard-card p-6 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Goal Header */}
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6">
                <div className="flex-1">
                  <h4 className="text-xl font-semibold mb-2">{goal.title}</h4>
                  {goal.description && (
                    <p className="text-muted mb-4">{goal.description}</p>
                  )}
                  
                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="text-accent font-medium">{goal.progress}%</span>
                    </div>
                    <div className="w-full bg-muted/20 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-accent to-accent/80 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
                
                {goal.targetDate && (
                  <div className="flex items-center gap-2 text-sm text-muted">
                    <Calendar className="w-4 h-4" />
                    {new Date(goal.targetDate).toLocaleDateString()}
                  </div>
                )}
              </div>

              {/* Achievements */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h5 className="font-medium">Achievements</h5>
                  <span className="text-sm text-muted">
                    {goal.achievements.filter(a => a.completed).length} of {goal.achievements.length}
                  </span>
                </div>
                
                <div className="space-y-2">
                  {goal.achievements.map(achievement => (
                    <div 
                      key={achievement.id}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/10 transition-colors"
                    >
                      <button
                        onClick={() => toggleAchievement(goal.id, achievement.id)}
                        className="mt-0.5 text-accent hover:scale-110 transition-transform"
                      >
                        {achievement.completed ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                      </button>
                      <span 
                        className={`flex-1 text-sm transition-all ${
                          achievement.completed 
                            ? 'text-muted line-through' 
                            : 'text-foreground'
                        }`}
                      >
                        {achievement.text}
                      </span>
                    </div>
                  ))}
                  
                  {/* Add Achievement */}
                  <div className="flex items-center gap-3 p-3">
                    <Plus className="w-4 h-4 text-muted" />
                    <Input
                      placeholder="Add new achievement..."
                      className="input-field text-sm"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const input = e.currentTarget;
                          addAchievement(goal.id, input.value);
                          input.value = '';
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {activeGoals.length === 0 && (
            <div className="dashboard-card p-8 text-center">
              <Target className="w-12 h-12 mx-auto mb-4 text-muted opacity-40" />
              <p className="text-muted mb-4">No active goals yet</p>
              <Button onClick={() => setShowAddForm(true)} className="btn-primary">
                Set Your First Goal
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default GoalsPage;