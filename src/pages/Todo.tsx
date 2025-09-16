import { useState } from "react";
import { ArrowLeft, Plus, X, CheckCircle2, Circle, Filter, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: string;
  category: string;
  priority: "low" | "medium" | "high";
}

const TodoPage = () => {
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: "1", text: "Fix screens at rental house", completed: false, category: "House", priority: "high", dueDate: "2025-09-20" },
    { id: "2", text: "Fix steps at rental house", completed: false, category: "House", priority: "high", dueDate: "2025-09-22" },
    { id: "3", text: "Fix Master Bath paint flaking", completed: false, category: "House", priority: "medium", dueDate: "2025-09-25" },
    { id: "4", text: "Fix basement bath nail pops", completed: false, category: "House", priority: "medium", dueDate: "2025-09-30" },
    { id: "5", text: "Fix Master Bath moisture issue by door", completed: false, category: "House", priority: "high", dueDate: "2025-09-18" },
  ]);
  
  const [newTodo, setNewTodo] = useState({
    text: "",
    category: "Personal",
    priority: "medium" as "low" | "medium" | "high",
    dueDate: ""
  });
  
  const [filter, setFilter] = useState<"all" | "today" | "completed">("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  const handleAddTodo = () => {
    if (!newTodo.text.trim()) return;
    
    const todo: TodoItem = {
      id: Date.now().toString(),
      text: newTodo.text.trim(),
      completed: false,
      category: newTodo.category,
      priority: newTodo.priority,
      dueDate: newTodo.dueDate || undefined
    };
    
    setTodos(prev => [...prev, todo]);
    setNewTodo({ text: "", category: "Personal", priority: "medium", dueDate: "" });
    setShowAddForm(false);
    
    toast({
      description: "Todo added successfully",
      duration: 2000,
    });
  };

  const handleToggle = (id: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const handleDelete = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
    toast({
      description: "Todo removed",
      duration: 2000,
    });
  };

  const today = new Date().toISOString().split('T')[0];
  
  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case "today":
        return todo.dueDate === today && !todo.completed;
      case "completed":
        return todo.completed;
      default:
        return true;
    }
  });

  const completedCount = todos.filter(todo => todo.completed).length;
  const todayCount = todos.filter(todo => todo.dueDate === today && !todo.completed).length;
  const overallProgress = todos.length > 0 ? (completedCount / todos.length) * 100 : 0;
  const todayProgress = todayCount > 0 ? ((todos.filter(todo => todo.dueDate === today && todo.completed).length) / (todayCount + todos.filter(todo => todo.dueDate === today && todo.completed).length)) * 100 : 0;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-danger";
      case "medium": return "text-warning";
      case "low": return "text-accent";
      default: return "text-muted";
    }
  };

  const getPriorityBg = (priority: string) => {
    switch (priority) {
      case "high": return "bg-danger/10";
      case "medium": return "bg-warning/10";
      case "low": return "bg-accent/10";
      default: return "bg-muted/10";
    }
  };

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
                <h1 className="text-xl font-bold">To-Do List</h1>
                <p className="text-sm text-muted">Manage your tasks</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="dashboard-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="w-8 h-8 text-accent" />
              <div>
                <h3 className="font-semibold">Overall Progress</h3>
                <p className="text-2xl font-bold text-accent">{Math.round(overallProgress)}%</p>
              </div>
            </div>
            <div className="w-full bg-muted/20 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-accent to-accent/80 h-2 rounded-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <p className="text-sm text-muted mt-2">{completedCount} of {todos.length} completed</p>
          </div>

          <div className="dashboard-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-8 h-8 text-warning" />
              <div>
                <h3 className="font-semibold">Today's Tasks</h3>
                <p className="text-2xl font-bold text-warning">{todayCount}</p>
              </div>
            </div>
            <div className="w-full bg-muted/20 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-warning to-warning/80 h-2 rounded-full transition-all duration-500"
                style={{ width: `${todayProgress}%` }}
              />
            </div>
            <p className="text-sm text-muted mt-2">{Math.round(todayProgress)}% complete today</p>
          </div>

          <div className="dashboard-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <Circle className="w-8 h-8 text-primary" />
              <div>
                <h3 className="font-semibold">Pending</h3>
                <p className="text-2xl font-bold text-primary">{todos.length - completedCount}</p>
              </div>
            </div>
            <div className="space-y-1 mt-4">
              <div className="flex justify-between text-xs">
                <span className="text-danger">High</span>
                <span>{todos.filter(t => !t.completed && t.priority === "high").length}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-warning">Medium</span>
                <span>{todos.filter(t => !t.completed && t.priority === "medium").length}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-accent">Low</span>
                <span>{todos.filter(t => !t.completed && t.priority === "low").length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
              className={filter === "all" ? "btn-primary" : ""}
            >
              <Filter className="w-4 h-4 mr-1" />
              All ({todos.length})
            </Button>
            <Button
              variant={filter === "today" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("today")}
              className={filter === "today" ? "btn-primary" : ""}
            >
              <Calendar className="w-4 h-4 mr-1" />
              Today ({todayCount})
            </Button>
            <Button
              variant={filter === "completed" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("completed")}
              className={filter === "completed" ? "btn-primary" : ""}
            >
              <CheckCircle2 className="w-4 h-4 mr-1" />
              Completed ({completedCount})
            </Button>
          </div>
          
          <Button onClick={() => setShowAddForm(true)} className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>

        {/* Add Todo Form */}
        {showAddForm && (
          <div className="dashboard-card p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Add New Task</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                placeholder="Task description"
                value={newTodo.text}
                onChange={(e) => setNewTodo(prev => ({ ...prev, text: e.target.value }))}
                className="input-field"
              />
              <select
                value={newTodo.category}
                onChange={(e) => setNewTodo(prev => ({ ...prev, category: e.target.value }))}
                className="input-field"
              >
                <option value="Personal">Personal</option>
                <option value="Work">Work</option>
                <option value="House">House</option>
                <option value="Health">Health</option>
                <option value="Finance">Finance</option>
              </select>
              <select
                value={newTodo.priority}
                onChange={(e) => setNewTodo(prev => ({ ...prev, priority: e.target.value as "low" | "medium" | "high" }))}
                className="input-field"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <Input
                type="date"
                value={newTodo.dueDate}
                onChange={(e) => setNewTodo(prev => ({ ...prev, dueDate: e.target.value }))}
                className="input-field"
              />
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleAddTodo} className="btn-primary">
                Add Task
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

        {/* Todo List */}
        <div className="space-y-3">
          {filteredTodos.map((todo, index) => (
            <div 
              key={todo.id}
              className="dashboard-card p-4 animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start gap-4">
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => handleToggle(todo.id)}
                  className="mt-1 data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <span 
                        className={`block text-sm font-medium transition-all ${
                          todo.completed 
                            ? 'text-muted line-through' 
                            : 'text-foreground'
                        }`}
                      >
                        {todo.text}
                      </span>
                      
                      <div className="flex items-center gap-3 mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityBg(todo.priority)} ${getPriorityColor(todo.priority)}`}>
                          {todo.priority} priority
                        </span>
                        <span className="text-xs px-2 py-1 bg-muted/20 text-muted rounded-full">
                          {todo.category}
                        </span>
                        {todo.dueDate && (
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            todo.dueDate === today 
                              ? 'bg-warning/20 text-warning' 
                              : todo.dueDate < today && !todo.completed
                              ? 'bg-danger/20 text-danger'
                              : 'bg-muted/20 text-muted'
                          }`}>
                            {todo.dueDate === today ? 'Due today' : 
                             todo.dueDate < today && !todo.completed ? 'Overdue' :
                             new Date(todo.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleDelete(todo.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity btn-ghost p-2"
                    >
                      <X className="w-4 h-4 text-danger" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {filteredTodos.length === 0 && (
            <div className="dashboard-card p-8 text-center">
              <Circle className="w-12 h-12 mx-auto mb-4 text-muted opacity-40" />
              <p className="text-muted mb-4">
                {filter === "today" ? "No tasks due today" :
                 filter === "completed" ? "No completed tasks yet" :
                 "No tasks yet"}
              </p>
              {filter === "all" && (
                <Button onClick={() => setShowAddForm(true)} className="btn-primary">
                  Add Your First Task
                </Button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TodoPage;