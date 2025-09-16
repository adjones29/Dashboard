import { useEffect, useState } from "react";
import { listRoutines, updateRoutine } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

interface Routine {
  id: string;
  text: string;
  done: boolean;
  position: number;
}

const RoutinesWidget = () => {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadRoutines();
  }, []);

  const loadRoutines = async () => {
    try {
      const { data, error } = await listRoutines();
      if (error) throw error;
      setRoutines(data || []);
    } catch (error) {
      console.error("Error loading routines:", error);
      toast({
        title: "Error",
        description: "Failed to load routines",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleRoutine = async (id: string, done: boolean) => {
    try {
      const { error } = await updateRoutine(id, { done });
      if (error) throw error;
      
      setRoutines(prev => prev.map(routine =>
        routine.id === id ? { ...routine, done } : routine
      ));
    } catch (error) {
      console.error("Error updating routine:", error);
      toast({
        title: "Error",
        description: "Failed to update routine",
        variant: "destructive",
      });
    }
  };

  const completedCount = routines.filter(routine => routine.done).length;
  const totalCount = routines.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  if (loading) {
    return (
      <div className="dashboard-card p-6 cursor-pointer hover:shadow-lg transition-shadow"
           onClick={() => window.location.hash = '#/routines'}>
        <div className="animate-pulse">
          <div className="h-4 bg-muted/20 rounded mb-2"></div>
          <div className="h-8 bg-muted/20 rounded mb-4"></div>
          <div className="h-2 bg-muted/20 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-card p-6 cursor-pointer hover:shadow-lg transition-shadow"
         onClick={() => window.location.hash = '#/routines'}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-warning/20 to-accent/10 rounded-xl flex items-center justify-center">
          <span className="text-warning text-lg">⚡</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Daily Routine</h3>
          <p className="text-sm text-muted">Your daily habits</p>
        </div>
      </div>
      <div className="space-y-3">
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>Today's Progress</span>
            <span className="text-warning">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-muted/20 rounded-full h-2">
            <div className="bg-gradient-to-r from-warning to-warning/80 h-2 rounded-full transition-all duration-500" 
                 style={{width: `${progress}%`}}></div>
          </div>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted">{completedCount} of {totalCount} completed</span>
          <span className="text-primary hover:underline">View all →</span>
        </div>
      </div>
    </div>
  );
};

export default RoutinesWidget;