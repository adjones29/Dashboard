import { useEffect, useState } from "react";
import { Sun, Moon, Search, RefreshCw, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CountdownCard from "@/components/CountdownCard";
import TodoCard from "@/components/TodoCard";
import RoutineCard from "@/components/RoutineCard";
import KanbanCard from "@/components/KanbanCard";
import GoalsCard from "@/components/GoalsCard";
import ScratchpadCard from "@/components/ScratchpadCard";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);
  const [greeting, setGreeting] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const { toast } = useToast();

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("dashboard-theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
    
    setTheme(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);
  }, []);

  // Set greeting and date
  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    
    let greetingText = "Good Evening";
    if (hour < 12) greetingText = "Good Morning";
    else if (hour < 17) greetingText = "Good Afternoon";
    
    setGreeting(`${greetingText}, Adam`);
    setCurrentDate(now.toLocaleDateString("en-US", { 
      weekday: "long", 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    }));
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("dashboard-theme", newTheme);
    
    toast({
      description: `Switched to ${newTheme} mode`,
      duration: 2000,
    });
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg to-bg/80 transition-all duration-500">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-border/40">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo & Title */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold">Dashboard</h1>
                <p className="text-sm text-muted">{greeting}</p>
              </div>
            </div>

            {/* Center: Search */}
            <div className="flex-1 max-w-md mx-8 hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted w-4 h-4" />
                <Input 
                  placeholder="Search dashboard..." 
                  className="pl-10 bg-surface/50 border-border/40 focus:border-primary/50"
                />
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center space-x-2">
              <span className="hidden lg:block text-sm text-muted font-medium">
                {currentDate}
              </span>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleRefresh}
                className="hover:bg-muted/20"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>

              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleTheme}
                className="hover:bg-muted/20"
              >
                {theme === "light" ? 
                  <Moon className="w-4 h-4" /> : 
                  <Sun className="w-4 h-4" />
                }
              </Button>

              <Button variant="ghost" size="sm" className="hover:bg-muted/20">
                <User className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions Bar */}
        <div className="mb-8 flex gap-4 overflow-x-auto pb-2">
          <Button className="btn-primary whitespace-nowrap">
            📊 Analytics
          </Button>
          <Button variant="outline" className="whitespace-nowrap border-border/40 hover:border-primary/50">
            ⚡ Quick Add
          </Button>
          <Button variant="outline" className="whitespace-nowrap border-border/40 hover:border-primary/50">
            📋 Templates
          </Button>
          <Button variant="outline" className="whitespace-nowrap border-border/40 hover:border-primary/50">
            ⚙️ Settings
          </Button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Row 1: Top Cards */}
          <div className="lg:col-span-4">
            <CountdownCard />
          </div>
          <div className="lg:col-span-4">
            <TodoCard />
          </div>
          <div className="lg:col-span-4">
            <RoutineCard />
          </div>

          {/* Row 2: Wide Cards */}
          <div className="lg:col-span-8">
            <KanbanCard />
          </div>
          <div className="lg:col-span-4">
            <GoalsCard />
          </div>

          {/* Row 3: Single Card (Scratchpad only, Open Space removed) */}
          <div className="lg:col-span-6">
            <ScratchpadCard />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;