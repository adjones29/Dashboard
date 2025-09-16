import { useState } from "react";
import { Plus, X, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

const TodoCard = () => {
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: "1", text: "Fix screens at rental house", completed: false },
    { id: "2", text: "Fix steps at rental house", completed: false },
    { id: "3", text: "Fix Master Bath paint flaking", completed: false },
    { id: "4", text: "Fix basement bath nail pops", completed: false },
    { id: "5", text: "Fix Master Bath moisture issue by door", completed: false },
  ]);
  const [newTodo, setNewTodo] = useState("");
  const { toast } = useToast();

  const handleAdd = () => {
    if (!newTodo.trim()) return;
    
    const todo: TodoItem = {
      id: Date.now().toString(),
      text: newTodo.trim(),
      completed: false
    };
    
    setTodos(prev => [...prev, todo]);
    setNewTodo("");
    
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const progress = todos.length > 0 ? (completedCount / todos.length) * 100 : 0;

  return (
    <div className="dashboard-card p-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-accent/20 to-primary/10 rounded-xl flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">To-Do List</h2>
            <p className="text-sm text-muted">
              {completedCount} of {todos.length} completed
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-muted mb-2">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-muted/20 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-accent to-accent/80 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Add Todo */}
      <div className="flex gap-2 mb-6">
        <Input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a new todo..."
          className="input-field flex-1"
        />
        <Button onClick={handleAdd} className="btn-primary">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Todo List */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {todos.map((todo, index) => (
          <div 
            key={todo.id}
            className="task-item group animate-fade-in"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <Checkbox
              checked={todo.completed}
              onCheckedChange={() => handleToggle(todo.id)}
              className="data-[state=checked]:bg-accent data-[state=checked]:border-accent"
            />
            <span 
              className={`flex-1 transition-all ${
                todo.completed 
                  ? 'text-muted line-through' 
                  : 'text-foreground'
              }`}
            >
              {todo.text}
            </span>
            <button
              onClick={() => handleDelete(todo.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity btn-ghost p-1"
            >
              <X className="w-4 h-4 text-danger" />
            </button>
          </div>
        ))}
        
        {todos.length === 0 && (
          <div className="text-center py-8 text-muted">
            <Circle className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p>No todos yet. Add your first task!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoCard;