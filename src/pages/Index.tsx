import { useEffect, useState } from "react";
import { Sun, Moon, Search, RefreshCw, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import KanbanSummaryCard from "@/components/KanbanSummaryCard";
import ScratchpadCard from "@/components/ScratchpadCard";

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
        {/* Navigation Tabs */}
        <div className="mb-8 flex gap-4 overflow-x-auto pb-2">
          <Button 
            className="btn-primary whitespace-nowrap"
            onClick={() => window.location.hash = '#/routines'}
          >
            ⚡ Routines
          </Button>
          <Button 
            variant="outline" 
            className="whitespace-nowrap border-border/40 hover:border-primary/50"
            onClick={() => window.location.hash = '#/goals'}
          >
            🎯 Goals
          </Button>
          <Button 
            variant="outline" 
            className="whitespace-nowrap border-border/40 hover:border-primary/50"
            onClick={() => window.location.hash = '#/todo'}
          >
            ✅ To-Do
          </Button>
          <Button 
            variant="outline" 
            className="whitespace-nowrap border-border/40 hover:border-primary/50"
            onClick={() => window.location.hash = '#/kanban'}
          >
            📋 Kanban
          </Button>
          <Button 
            variant="outline" 
            className="whitespace-nowrap border-border/40 hover:border-primary/50"
            onClick={() => window.location.hash = '#/quick-links'}
          >
            🔗 Quick Links
          </Button>
          <Button 
            variant="outline" 
            className="whitespace-nowrap border-border/40 hover:border-primary/50"
            onClick={() => window.location.hash = '#/countdowns'}
          >
            ⏰ Countdowns
          </Button>
        </div>

        {/* Summary Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Routines Summary */}
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
                  <span>Morning Workout</span>
                  <span className="text-warning">75%</span>
                </div>
                <div className="w-full bg-muted/20 rounded-full h-2">
                  <div className="bg-gradient-to-r from-warning to-warning/80 h-2 rounded-full" style={{width: '75%'}}></div>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted">3 of 4 completed</span>
                <span className="text-primary hover:underline">View all →</span>
              </div>
            </div>
          </div>

          {/* Goals Summary */}
          <div className="dashboard-card p-6 cursor-pointer hover:shadow-lg transition-shadow"
               onClick={() => window.location.hash = '#/goals'}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-accent/20 to-primary/10 rounded-xl flex items-center justify-center">
                <span className="text-accent text-lg">🎯</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Goals</h3>
                <p className="text-sm text-muted">Track your progress</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>NextGen Onboarding</span>
                  <span className="text-accent">75%</span>
                </div>
                <div className="w-full bg-muted/20 rounded-full h-2">
                  <div className="bg-gradient-to-r from-accent to-accent/80 h-2 rounded-full" style={{width: '75%'}}></div>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted">3 active goals</span>
                <span className="text-primary hover:underline">View all →</span>
              </div>
            </div>
          </div>

          {/* To-Do Summary */}
          <div className="dashboard-card p-6 cursor-pointer hover:shadow-lg transition-shadow"
               onClick={() => window.location.hash = '#/todo'}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-warning/20 to-danger/10 rounded-xl flex items-center justify-center">
                <span className="text-warning text-lg">✅</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">To-Do List</h3>
                <p className="text-sm text-muted">Today's tasks</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>House Maintenance</span>
                  <span className="text-warning">0%</span>
                </div>
                <div className="w-full bg-muted/20 rounded-full h-2">
                  <div className="bg-gradient-to-r from-warning to-warning/80 h-2 rounded-full" style={{width: '0%'}}></div>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted">5 items pending</span>
                <span className="text-primary hover:underline">View all →</span>
              </div>
            </div>
          </div>

          {/* Kanban Summary */}
          <KanbanSummaryCard />

          {/* Quick Links Summary */}
          <div className="dashboard-card p-6 cursor-pointer hover:shadow-lg transition-shadow" 
               onClick={() => window.location.hash = '#/quick-links'}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-accent/10 rounded-xl flex items-center justify-center">
                <span className="text-primary text-lg">🔗</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Quick Links</h3>
                <p className="text-sm text-muted">Access your shortcuts</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted">Ready to add your favorite links</p>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted">0 links saved</span>
                <span className="text-primary hover:underline">View all →</span>
              </div>
            </div>
          </div>

          {/* Countdown Clock Summary */}
          <div className="dashboard-card p-6 cursor-pointer hover:shadow-lg transition-shadow"
               onClick={() => window.location.hash = '#/countdowns'}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-danger/20 to-warning/10 rounded-xl flex items-center justify-center">
                <span className="text-danger text-lg">⏰</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Countdown Clock</h3>
                <p className="text-sm text-muted">Track important dates</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Project Deadline</span>
                  <span className="text-danger font-semibold">12 days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Birthday Party</span>
                  <span className="text-warning font-semibold">45 days</span>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted">3 countdowns active</span>
                <span className="text-primary hover:underline">View all →</span>
              </div>
            </div>
          </div>
        </div>

        {/* Full Width Scratchpad Section */}
        <div className="mt-8">
          <ScratchpadCard />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;