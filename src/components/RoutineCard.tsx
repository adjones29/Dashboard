import { useState } from "react";
import { Plus, X, Zap, Circle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface RoutineItem {
  id: string;
  text: string;
  completed: boolean;
}

const RoutineCard = () => {
  const [routines, setRoutines] = useState<RoutineItem[]>([
    { id: "1", text: "25 push ups", completed: false },
    { id: "2", text: "25 squats", completed: false },
    { id: "3", text: "50 situps", completed: false },
    { id: "4", text: "2 min jumping jacks", completed: false },
  ]);
  const [newRoutine, setNewRoutine] = useState("");
  const { toast } = useToast();

  const handleAdd = () => {
    if (!newRoutine.trim()) return;
    
    const routine: RoutineItem = {
      id: Date.now().toString(),
      text: newRoutine.trim(),
      completed: false
    };
    
    setRoutines(prev => [...prev, routine]);
    setNewRoutine("");
    
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  const completedCount = routines.filter(routine => routine.completed).length;
  const progress = routines.length > 0 ? (completedCount / routines.length) * 100 : 0;

  return (
    <div className="dashboard-card p-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-warning/20 to-accent/10 rounded-xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-warning" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Daily Routine</h2>
            <p className="text-sm text-muted">
              {completedCount} of {routines.length} done today
            </p>
          </div>
        </div>
      </div>

      {/* Progress Ring - Visual Enhancement */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-20 h-20">
          <svg className="transform -rotate-90 w-20 h-20">
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="hsl(var(--muted))"
              strokeWidth="4"
              fill="none"
              className="opacity-20"
            />
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="hsl(var(--warning))"
              strokeWidth="4"
              fill="none"
              strokeDasharray={226.19}
              strokeDashoffset={226.19 - (226.19 * progress) / 100}
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold text-warning">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      </div>

      {/* Add Routine */}
      <div className="mb-6">
        <Input
          value={newRoutine}
          onChange={(e) => setNewRoutine(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add routine..."
          className="input-field"
        />
      </div>

      {/* Routine List */}
      <div className="space-y-3 max-h-48 overflow-y-auto">
        {routines.map((routine, index) => (
          <div 
            key={routine.id}
            className="task-item group animate-fade-in"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <Checkbox
              checked={routine.completed}
              onCheckedChange={() => handleToggle(routine.id)}
              className="data-[state=checked]:bg-warning data-[state=checked]:border-warning"
            />
            <span 
              className={`flex-1 transition-all ${
                routine.completed 
                  ? 'text-muted line-through' 
                  : 'text-foreground'
              }`}
            >
              {routine.text}
            </span>
            <button
              onClick={() => handleDelete(routine.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity btn-ghost p-1"
            >
              <X className="w-4 h-4 text-danger" />
            </button>
          </div>
        ))}
        
        {routines.length === 0 && (
          <div className="text-center py-8 text-muted">
            <Circle className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p>No routines yet. Add your daily habits!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoutineCard;