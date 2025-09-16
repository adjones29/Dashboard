import { useState } from "react";
import { ArrowLeft, Plus, Target, Calendar, CheckCircle, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useGoals } from "@/hooks/useGoals";
import { useAuth } from "@/hooks/useAuth";

const GoalsPage = () => {
  const { goals, loading, addGoal, addGoalItem, toggleGoalItem } = useGoals();
  const { user } = useAuth();

  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: "",
  });
  const { toast } = useToast();

  const handleAddGoal = async () => {
    if (!newGoal.title.trim()) return;

    const result = await addGoal({ title: newGoal.title.trim() });
    
    if (result.error) return;

    setNewGoal({ title: "" });
    setShowAddForm(false);
  };

  const handleToggleGoalItem = async (itemId: string) => {
    await toggleGoalItem(itemId);
  };

  const handleAddGoalItem = async (goalId: string, text: string) => {
    if (!text.trim()) return;
    await addGoalItem(goalId, text.trim());
  };

  const activeGoals = goals;
  const overallProgress = goals.length > 0 
    ? Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bg to-bg/80 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted">Loading goals...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bg to-bg/80 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Please log in to manage your goals</h2>
          <Button onClick={() => window.location.hash = '#/auth'} className="btn-primary">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

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
              <span>0 Completed</span>
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
              </div>

              {/* Achievements */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h5 className="font-medium">Key Results</h5>
                  <span className="text-sm text-muted">
                    {goal.items.filter(item => item.text?.includes('✓') || item.text?.includes('[x]')).length} of {goal.items.length}
                  </span>
                </div>
                
                <div className="space-y-2">
                  {goal.items.map(item => {
                    const isCompleted = item.text?.includes('✓') || item.text?.includes('[x]');
                    return (
                      <div 
                        key={item.id}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/10 transition-colors"
                      >
                        <button
                          onClick={() => handleToggleGoalItem(item.id)}
                          className="mt-0.5 text-accent hover:scale-110 transition-transform"
                        >
                          {isCompleted ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <Circle className="w-4 h-4" />
                          )}
                        </button>
                        <span 
                          className={`flex-1 text-sm transition-all ${
                            isCompleted
                              ? 'text-muted line-through' 
                              : 'text-foreground'
                          }`}
                        >
                          {item.text?.replace(/^✓\s*/, '').replace(/^\[x\]\s*/, '') || ''}
                        </span>
                      </div>
                    );
                  })}
                  
                  {/* Add Achievement */}
                  <div className="flex items-center gap-3 p-3">
                    <Plus className="w-4 h-4 text-muted" />
                    <Input
                      placeholder="Add new key result..."
                      className="input-field text-sm"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const input = e.currentTarget;
                          handleAddGoalItem(goal.id, input.value);
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