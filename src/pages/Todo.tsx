import { useState } from "react";
import { ArrowLeft, Plus, X, CheckCircle2, Circle, Filter, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useTodos } from "@/hooks/useTodos";
import { useAuth } from "@/hooks/useAuth";

const TodoPage = () => {
  const { todos, loading, addTodo, deleteTodo, toggleTodo } = useTodos();
  const { user } = useAuth();
  
  const [newTodo, setNewTodo] = useState({
    text: "",
  });
  
  const [filter, setFilter] = useState<"all" | "completed">("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  const handleAddTodo = async () => {
    if (!newTodo.text.trim()) return;
    
    const result = await addTodo({ text: newTodo.text.trim() });
    
    if (result.error) return;
    
    setNewTodo({ text: "" });
    setShowAddForm(false);
  };

  const handleToggle = async (id: string) => {
    await toggleTodo(id);
  };

  const handleDelete = async (id: string) => {
    await deleteTodo(id);
  };

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case "completed":
        return todo.done;
      default:
        return true;
    }
  });

  const completedCount = todos.filter(todo => todo.done).length;
  const overallProgress = todos.length > 0 ? (completedCount / todos.length) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bg to-bg/80 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted">Loading todos...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bg to-bg/80 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Please log in to manage your todos</h2>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
              <Circle className="w-8 h-8 text-primary" />
              <div>
                <h3 className="font-semibold">Pending</h3>
                <p className="text-2xl font-bold text-primary">{todos.length - completedCount}</p>
              </div>
            </div>
            <div className="space-y-1 mt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Total Tasks</span>
                <span>{todos.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-accent">Completed</span>
                <span>{completedCount}</span>
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
            <div className="flex gap-4">
              <Input
                placeholder="Task description"
                value={newTodo.text}
                onChange={(e) => setNewTodo(prev => ({ ...prev, text: e.target.value }))}
                className="input-field flex-1"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddTodo();
                  }
                }}
              />
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
              className="dashboard-card p-4 animate-fade-in group"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start gap-4">
                <Checkbox
                  checked={todo.done || false}
                  onCheckedChange={() => handleToggle(todo.id)}
                  className="mt-1 data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <span 
                      className={`block text-sm font-medium transition-all ${
                        todo.done 
                          ? 'text-muted line-through' 
                          : 'text-foreground'
                      }`}
                    >
                      {todo.text}
                    </span>
                    
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
                {filter === "completed" ? "No completed tasks yet" : "No tasks yet"}
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