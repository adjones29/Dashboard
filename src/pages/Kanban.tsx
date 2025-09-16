import { useEffect, useState } from "react";
import { ArrowLeft, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { listKanbanTasks, createKanbanTask, updateKanbanTask, deleteKanbanTask } from "@/lib/data";

interface KanbanTask {
  id: string;
  text: string;
  column: string;
  position: number;
}

const COLUMN_CONFIG = {
  backlog: { title: "Backlog", color: "bg-muted/50", textColor: "text-muted-foreground" },
  todo: { title: "To Do", color: "bg-primary/10", textColor: "text-primary" },
  doing: { title: "Doing", color: "bg-warning/10", textColor: "text-warning" },
  done: { title: "Done", color: "bg-accent/10", textColor: "text-accent" }
};

const Kanban = () => {
  const [tasks, setTasks] = useState<KanbanTask[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<KanbanTask[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<KanbanTask | null>(null);
  const [newTask, setNewTask] = useState({
    text: "",
    column: "backlog" as keyof typeof COLUMN_CONFIG
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load tasks from Supabase
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const { data, error } = await listKanbanTasks();
      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error("Error loading tasks:", error);
      toast({
        title: "Error",
        description: "Failed to load tasks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter tasks based on search
  useEffect(() => {
    let filtered = tasks;
    
    if (searchTerm) {
      filtered = filtered.filter(task => 
        task.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredTasks(filtered);
  }, [tasks, searchTerm]);

  const handleAddTask = async () => {
    if (!newTask.text.trim()) return;

    const maxPosition = Math.max(
      ...tasks.filter(t => t.column === newTask.column).map(t => t.position),
      -1
    );

    const task = {
      text: newTask.text.trim(),
      column: newTask.column,
      position: maxPosition + 1,
    };

    try {
      const { data, error } = await createKanbanTask(task);
      if (error) throw error;
      
      if (data && data[0]) {
        setTasks(prev => [...prev, data[0]]);
        setNewTask({ text: "", column: "backlog" });
        setIsAddTaskOpen(false);
        
        toast({
          description: `Task added to ${COLUMN_CONFIG[newTask.column].title}`,
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Error creating task:", error);
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
    }
  };

  const handleUpdateTask = async () => {
    if (!editingTask || !editingTask.text.trim()) return;

    try {
      const { data, error } = await updateKanbanTask(editingTask.id, {
        text: editingTask.text,
        column: editingTask.column,
        position: editingTask.position
      });
      if (error) throw error;
      
      setTasks(prev => prev.map(task => 
        task.id === editingTask.id ? editingTask : task
      ));
      setEditingTask(null);
      
      toast({
        description: "Task updated successfully",
        duration: 2000,
      });
    } catch (error) {
      console.error("Error updating task:", error);
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const { error } = await deleteKanbanTask(taskId);
      if (error) throw error;
      
      setTasks(prev => prev.filter(task => task.id !== taskId));
      
      toast({
        description: "Task deleted",
        duration: 2000,
      });
    } catch (error) {
      console.error("Error deleting task:", error);
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceColumn = source.droppableId;
    const destinationColumn = destination.droppableId;

    const updatedTasks = [...tasks];
    const taskToMove = updatedTasks.find(task => task.id === result.draggableId);
    
    if (!taskToMove) return;

    // Update the task
    taskToMove.column = destinationColumn;
    taskToMove.position = destination.index;

    setTasks(updatedTasks);

    // Update in database
    try {
      const { error } = await updateKanbanTask(taskToMove.id, {
        column: destinationColumn,
        position: destination.index
      });
      if (error) throw error;
      
      if (sourceColumn !== destinationColumn) {
        toast({
          description: `Task moved to ${COLUMN_CONFIG[destinationColumn as keyof typeof COLUMN_CONFIG].title}`,
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Error updating task position:", error);
      // Revert the change
      loadTasks();
      toast({
        title: "Error",
        description: "Failed to move task",
        variant: "destructive",
      });
    }
  };

  const getTasksByColumn = (column: string) => {
    return filteredTasks
      .filter(task => task.column === column)
      .sort((a, b) => a.position - b.position);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bg to-bg/80 transition-all duration-500">
        <div className="animate-pulse">
          <div className="h-16 bg-muted/20 mb-8"></div>
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-96 bg-muted/20 rounded-lg"></div>
              ))}
            </div>
          </div>
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
                <h1 className="text-xl font-bold">Kanban Board</h1>
                <p className="text-sm text-muted">Manage your tasks</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold">Project Board</h2>
            <Badge variant="outline" className="text-sm">
              {tasks.length} tasks
            </Badge>
          </div>

          {/* Search */}
          <div className="flex items-center gap-4">
            <Input 
              placeholder="Search tasks..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>
          
          <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
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
                  placeholder="Task description..."
                  className="input-field"
                />
                <Select value={newTask.column} onValueChange={(value: keyof typeof COLUMN_CONFIG) => setNewTask(prev => ({ ...prev, column: value }))}>
                  <SelectTrigger className="input-field">
                    <SelectValue placeholder="Select column" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(COLUMN_CONFIG).map(([column, config]) => (
                      <SelectItem key={column} value={column}>
                        {config.title}
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

        {/* Kanban Board */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(COLUMN_CONFIG).map(([column, config]) => {
              const columnTasks = getTasksByColumn(column);
              
              return (
                <div key={column} className="dashboard-card p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`font-semibold ${config.textColor}`}>
                      {config.title}
                    </h3>
                    <Badge variant="outline" className="text-xs">
                      {columnTasks.length}
                    </Badge>
                  </div>
                  
                  <Droppable droppableId={column}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`space-y-3 min-h-[400px] p-2 rounded-lg transition-colors ${
                          snapshot.isDraggingOver ? config.color : 'bg-transparent'
                        }`}
                      >
                        {columnTasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`group bg-surface p-3 rounded-xl border border-border/20 hover:border-border/40 transition-all cursor-move ${
                                  snapshot.isDragging ? 'shadow-lg rotate-1' : ''
                                }`}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="text-sm font-medium text-foreground flex-1 pr-2">
                                    {task.text}
                                  </h4>
                                  <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                      onClick={() => setEditingTask(task)}
                                      className="btn-ghost p-1 mr-1"
                                    >
                                      <Edit className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteTask(task.id)}
                                      className="btn-ghost p-1"
                                    >
                                      <Trash2 className="w-3 h-3 text-danger" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        
                        {columnTasks.length === 0 && (
                          <div className="text-center py-8 text-muted text-sm opacity-50">
                            Drop tasks here
                          </div>
                        )}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>

        {/* Edit Task Dialog */}
        <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
            </DialogHeader>
            {editingTask && (
              <div className="space-y-4 mt-4">
                <Input
                  value={editingTask.text}
                  onChange={(e) => setEditingTask(prev => prev ? { ...prev, text: e.target.value } : null)}
                  placeholder="Task description..."
                  className="input-field"
                />
                <Select value={editingTask.column} onValueChange={(value: string) => setEditingTask(prev => prev ? { ...prev, column: value } : null)}>
                  <SelectTrigger className="input-field">
                    <SelectValue placeholder="Select column" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(COLUMN_CONFIG).map(([column, config]) => (
                      <SelectItem key={column} value={column}>
                        {config.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleUpdateTask} className="btn-primary w-full">
                  Update Task
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Kanban;