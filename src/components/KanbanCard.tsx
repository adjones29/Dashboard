import { useState } from "react";
import { Plus, X, ArrowRight, Columns3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface KanbanTask {
  id: string;
  text: string;
  column: string;
}

type Column = {
  id: string;
  title: string;
  color: string;
};

const KanbanCard = () => {
  const columns: Column[] = [
    { id: "backlog", title: "Backlog", color: "muted" },
    { id: "open", title: "Open", color: "primary" },
    { id: "working", title: "Working", color: "warning" },
    { id: "approval", title: "With Team", color: "accent" },
    { id: "done", title: "Done", color: "accent" },
  ];

  const [tasks, setTasks] = useState<KanbanTask[]>([
    { id: "1", text: "Fix Kanban board moving tiles issues", column: "open" },
    { id: "2", text: "Record 10 minute demo", column: "open" },
    { id: "3", text: "Scratch pad content should be stored and retrieved on dashboard", column: "open" },
    { id: "4", text: "Remove Weather feature from header", column: "open" },
    { id: "5", text: "Standard User / Location fields for Manufacturing", column: "working" },
    { id: "6", text: "Get subscription widget working on Demo site", column: "approval" },
    { id: "7", text: "Look at Marketing content on The Point for Chip and see how we can use the demo site for it - Josh working on this", column: "approval" },
  ]);
  
  const [isOpen, setIsOpen] = useState(false);
  const [newTask, setNewTask] = useState({ text: "", column: "backlog" });
  const { toast } = useToast();

  const handleAddTask = () => {
    if (!newTask.text.trim()) return;
    
    const task: KanbanTask = {
      id: Date.now().toString(),
      text: newTask.text.trim(),
      column: newTask.column
    };
    
    setTasks(prev => [...prev, task]);
    setNewTask({ text: "", column: "backlog" });
    setIsOpen(false);
    
    toast({
      description: `Task added to ${columns.find(c => c.id === newTask.column)?.title}`,
      duration: 2000,
    });
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    toast({
      description: "Task deleted",
      duration: 2000,
    });
  };

  const moveTask = (taskId: string, newColumn: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, column: newColumn } : task
    ));
  };

  const getTasksByColumn = (columnId: string) => {
    return tasks.filter(task => task.column === columnId);
  };

  return (
    <div className="dashboard-card p-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-warning/10 rounded-xl flex items-center justify-center">
            <Columns3 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Kanban Board</h2>
            <p className="text-sm text-muted">{tasks.length} total tasks</p>
          </div>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <Input
                value={newTask.text}
                onChange={(e) => setNewTask(prev => ({ ...prev, text: e.target.value }))}
                placeholder="Enter task description..."
                className="input-field"
              />
              <Select value={newTask.column} onValueChange={(value) => setNewTask(prev => ({ ...prev, column: value }))}>
                <SelectTrigger className="input-field">
                  <SelectValue placeholder="Select column" />
                </SelectTrigger>
                <SelectContent>
                  {columns.map(column => (
                    <SelectItem key={column.id} value={column.id}>
                      {column.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleAddTask} className="btn-primary w-full">
                Add Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 h-96 overflow-y-auto">
        {columns.map(column => {
          const columnTasks = getTasksByColumn(column.id);
          
          return (
            <div key={column.id} className="kanban-column">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm text-foreground">{column.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium status-${column.color} border`}>
                  {columnTasks.length}
                </span>
              </div>
              
              <div className="space-y-3">
                {columnTasks.map((task, index) => (
                  <div 
                    key={task.id}
                    className="group bg-surface p-3 rounded-xl border border-border/20 hover:border-border/40 transition-all animate-fade-in cursor-move"
                    style={{ animationDelay: `${index * 0.05}s` }}
                    draggable
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm text-foreground flex-1 pr-2">
                        {task.text}
                      </span>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity btn-ghost p-1"
                      >
                        <X className="w-3 h-3 text-danger" />
                      </button>
                    </div>
                    
                    {/* Quick Move Actions */}
                    <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {columns
                        .filter(c => c.id !== column.id)
                        .slice(0, 2)
                        .map(targetCol => (
                          <button
                            key={targetCol.id}
                            onClick={() => moveTask(task.id, targetCol.id)}
                            className="text-xs px-2 py-1 bg-muted/20 hover:bg-muted/40 rounded text-muted-foreground hover:text-foreground transition-all"
                          >
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ))
                      }
                    </div>
                  </div>
                ))}
                
                {columnTasks.length === 0 && (
                  <div className="text-center py-4 text-muted text-sm opacity-50">
                    Drop tasks here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KanbanCard;