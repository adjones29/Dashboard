import { useState } from "react";
import { ArrowLeft, Plus, X, CheckCircle2, Circle, Zap, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface RoutineItem {
  id: string;
  text: string;
  completed: boolean;
  order: number;
}

const RoutinesPage = () => {
  const [routines, setRoutines] = useState<RoutineItem[]>([
    { id: "1", text: "Morning Workout", completed: true, order: 1 },
    { id: "2", text: "Meditation", completed: true, order: 2 },
    { id: "3", text: "Review Daily Goals", completed: true, order: 3 },
    { id: "4", text: "Check Important Emails", completed: false, order: 4 },
  ]);
  
  const [newRoutine, setNewRoutine] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  const handleAddRoutine = () => {
    if (!newRoutine.trim()) return;
    
    const routine: RoutineItem = {
      id: Date.now().toString(),
      text: newRoutine.trim(),
      completed: false,
      order: routines.length + 1
    };
    
    setRoutines(prev => [...prev, routine]);
    setNewRoutine("");
    setShowAddForm(false);
    
    toast({
      description: "Routine added successfully",
      duration: 2000,
    });
  };

  const handleToggle = (id: string) => {
    setRoutines(prev => prev.map(routine => 
      routine.id === id ? { ...routine, completed: !routine.completed } : routine
    ));
  };

  const handleDelete = (id: string) => {
    setRoutines(prev => prev.filter(routine => routine.id !== id));
    toast({
      description: "Routine removed",
      duration: 2000,
    });
  };

  const completedCount = routines.filter(routine => routine.completed).length;
  const overallProgress = routines.length > 0 ? (completedCount / routines.length) * 100 : 0;

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
                <h1 className="text-xl font-bold">Daily Routines</h1>
                <p className="text-sm text-muted">Your daily habits</p>
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
            <div className="w-12 h-12 bg-gradient-to-br from-warning/20 to-accent/10 rounded-2xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-warning" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Daily Routines</h2>
              <p className="text-muted">Build consistent habits for success</p>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between text-sm text-muted mb-2">
              <span>Today's Progress</span>
              <span>{Math.round(overallProgress)}%</span>
            </div>
            <div className="w-full bg-muted/20 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-warning to-warning/80 h-3 rounded-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-muted mt-2">
              <span>{completedCount} of {routines.length} completed</span>
              <span>{routines.length - completedCount} remaining</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="dashboard-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="w-8 h-8 text-warning" />
              <div>
                <h3 className="font-semibold">Completed</h3>
                <p className="text-2xl font-bold text-warning">{completedCount}</p>
              </div>
            </div>
            <p className="text-sm text-muted">Tasks finished today</p>
          </div>

          <div className="dashboard-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <Circle className="w-8 h-8 text-primary" />
              <div>
                <h3 className="font-semibold">Remaining</h3>
                <p className="text-2xl font-bold text-primary">{routines.length - completedCount}</p>
              </div>
            </div>
            <p className="text-sm text-muted">Tasks left to do</p>
          </div>

          <div className="dashboard-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-8 h-8 text-accent" />
              <div>
                <h3 className="font-semibold">Streak</h3>
                <p className="text-2xl font-bold text-accent">7</p>
              </div>
            </div>
            <p className="text-sm text-muted">Days in a row</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-semibold">Today's Routines</h3>
          <Button onClick={() => setShowAddForm(true)} className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Routine
          </Button>
        </div>

        {/* Add Routine Form */}
        {showAddForm && (
          <div className="dashboard-card p-6 mb-8">
            <h4 className="text-lg font-semibold mb-4">Add New Routine</h4>
            <div className="flex gap-4">
              <Input
                placeholder="Enter routine description"
                value={newRoutine}
                onChange={(e) => setNewRoutine(e.target.value)}
                className="input-field flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleAddRoutine()}
              />
              <Button onClick={handleAddRoutine} className="btn-primary">
                Add
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

        {/* Routines List */}
        <div className="space-y-3">
          {routines.sort((a, b) => a.order - b.order).map((routine, index) => (
            <div 
              key={routine.id}
              className="dashboard-card p-4 animate-fade-in hover:shadow-lg transition-all group"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-center gap-4">
                <Checkbox
                  checked={routine.completed}
                  onCheckedChange={() => handleToggle(routine.id)}
                  className="data-[state=checked]:bg-warning data-[state=checked]:border-warning"
                />
                
                <div className="flex-1">
                  <span 
                    className={`block text-sm font-medium transition-all ${
                      routine.completed 
                        ? 'text-muted line-through' 
                        : 'text-foreground'
                    }`}
                  >
                    {routine.text}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted">#{routine.order}</span>
                  <button
                    onClick={() => handleDelete(routine.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-danger/10 rounded-lg"
                  >
                    <X className="w-4 h-4 text-danger" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {routines.length === 0 && (
            <div className="dashboard-card p-8 text-center">
              <Zap className="w-12 h-12 mx-auto mb-4 text-muted opacity-40" />
              <p className="text-muted mb-4">No routines set yet</p>
              <Button onClick={() => setShowAddForm(true)} className="btn-primary">
                Create Your First Routine
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default RoutinesPage;