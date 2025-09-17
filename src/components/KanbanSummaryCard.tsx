import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { listKanbanTasks, KANBAN_STATUSES, type KanbanStatus } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

interface KanbanTask {
  id: string;
  text: string;
  column: string;
  position: number;
}

const COLUMN_CONFIG: Record<KanbanStatus, { title: string; bgColor: string; textColor: string }> = {
  'Backlog': { title: "Backlog", bgColor: "bg-muted/10", textColor: "text-muted-foreground" },
  'Open': { title: "Open", bgColor: "bg-primary/10", textColor: "text-primary" },
  'Working': { title: "Working", bgColor: "bg-warning/10", textColor: "text-warning" },
  'With Team': { title: "With Team", bgColor: "bg-accent/10", textColor: "text-accent" },
  'Done': { title: "Done", bgColor: "bg-success/10", textColor: "text-success" }
};

const KanbanSummaryCard = () => {
  const [tasks, setTasks] = useState<KanbanTask[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const { data, error } = await listKanbanTasks();
      if (error) throw error;
      
      // Flatten the buckets back to a single array for the summary card
      const allTasks: KanbanTask[] = [];
      for (const status of KANBAN_STATUSES) {
        allTasks.push(...(data[status] || []));
      }
      setTasks(allTasks);
    } catch (error) {
      console.error("Error loading kanban tasks:", error);
      toast({
        title: "Error",
        description: "Failed to load kanban tasks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getColumnCounts = () => {
    const counts: Record<KanbanStatus, number> = {
      'Backlog': tasks.filter(task => task.column === 'Backlog').length,
      'Open': tasks.filter(task => task.column === 'Open').length,
      'Working': tasks.filter(task => task.column === 'Working').length,
      'With Team': tasks.filter(task => task.column === 'With Team').length,
      'Done': tasks.filter(task => task.column === 'Done').length,
    };
    return counts;
  };

  const getRecentTasks = () => {
    return tasks
      .sort((a, b) => b.position - a.position)
      .slice(0, 3);
  };

  const columnCounts = getColumnCounts();
  const recentTasks = getRecentTasks();
  const totalTasks = tasks.length;

  if (loading) {
    return (
      <div className="dashboard-card p-6 cursor-pointer hover:shadow-lg transition-shadow" 
           onClick={() => window.location.hash = '#/kanban'}>
        <div className="animate-pulse">
          <div className="h-4 bg-muted/20 rounded mb-2"></div>
          <div className="h-8 bg-muted/20 rounded mb-4"></div>
          <div className="grid grid-cols-2 gap-2">
            <div className="h-12 bg-muted/20 rounded"></div>
            <div className="h-12 bg-muted/20 rounded"></div>
            <div className="h-12 bg-muted/20 rounded"></div>
            <div className="h-12 bg-muted/20 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-card p-6 cursor-pointer hover:shadow-lg transition-shadow" 
         onClick={() => window.location.hash = '#/kanban'}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-accent/10 rounded-xl flex items-center justify-center">
          <span className="text-primary text-lg">📋</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Kanban Board</h3>
          <p className="text-sm text-muted">Project overview</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {/* Total tasks count */}
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">{totalTasks}</p>
          <p className="text-xs text-muted">Total Tasks</p>
        </div>
        
        {/* Column counts */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {KANBAN_STATUSES.slice(0, 4).map((status) => (
            <div key={status} className={`p-2 rounded-lg ${COLUMN_CONFIG[status].bgColor}`}>
              <div className={`font-medium ${COLUMN_CONFIG[status].textColor}`}>
                {COLUMN_CONFIG[status].title}
              </div>
              <div className="text-lg font-bold">{columnCounts[status]}</div>
            </div>
          ))}
        </div>
        
        {/* Done count separately */}
        <div className={`p-2 rounded-lg ${COLUMN_CONFIG['Done'].bgColor}`}>
          <div className={`font-medium ${COLUMN_CONFIG['Done'].textColor}`}>
            {COLUMN_CONFIG['Done'].title}
          </div>
          <div className="text-lg font-bold">{columnCounts['Done']}</div>
        </div>
        
        {/* Recent tasks */}
        {recentTasks.length > 0 && (
          <div>
            <p className="text-xs text-muted mb-2 font-medium">Recent Tasks:</p>
            <div className="space-y-1">
              {recentTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between">
                  <span className="text-xs truncate flex-1 mr-2">{task.text}</span>
                  <span className={`text-xs px-1 py-0.5 rounded text-white ${
                    task.column === 'Done' ? 'bg-success' :
                    task.column === 'Working' ? 'bg-warning' :
                    task.column === 'With Team' ? 'bg-accent' :
                    task.column === 'Open' ? 'bg-primary' : 'bg-muted'
                  }`}>
                    {COLUMN_CONFIG[task.column as KanbanStatus]?.title || task.column}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted">
            {totalTasks === 0 ? "No tasks yet" : `${columnCounts['Done']} completed`}
          </span>
          <span className="text-primary hover:underline">Open Kanban →</span>
        </div>
      </div>
    </div>
  );
};

export default KanbanSummaryCard;