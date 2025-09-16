import { useState, useEffect } from "react";
import { ArrowLeft, Plus, X, Clock, Calendar, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface CountdownItem {
  id: string;
  name: string;
  date: string;
  description?: string;
}

const CountdownsPage = () => {
  const [countdowns, setCountdowns] = useState<CountdownItem[]>([
    { id: "1", name: "Project Deadline", date: "2025-09-28", description: "Final submission for Q3 project" },
    { id: "2", name: "Birthday Party", date: "2025-10-31", description: "Sarah's surprise party" },
    { id: "3", name: "Vacation Trip", date: "2025-12-15", description: "Family holiday to Europe" },
  ]);
  
  const [newCountdown, setNewCountdown] = useState({
    name: "",
    date: "",
    description: ""
  });
  
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  const handleAddCountdown = () => {
    if (!newCountdown.name.trim() || !newCountdown.date) return;
    
    const countdown: CountdownItem = {
      id: Date.now().toString(),
      name: newCountdown.name.trim(),
      date: newCountdown.date,
      description: newCountdown.description.trim() || undefined
    };
    
    setCountdowns(prev => [...prev, countdown]);
    setNewCountdown({ name: "", date: "", description: "" });
    setShowAddForm(false);
    
    toast({
      description: "Countdown added successfully",
      duration: 2000,
    });
  };

  const handleDelete = (id: string) => {
    setCountdowns(prev => prev.filter(countdown => countdown.id !== id));
    toast({
      description: "Countdown removed",
      duration: 2000,
    });
  };

  const calculateTimeLeft = (targetDate: string) => {
    const now = new Date().getTime();
    const target = new Date(targetDate).getTime();
    const difference = target - now;

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      
      return { days, hours, minutes, expired: false };
    }
    
    return { days: 0, hours: 0, minutes: 0, expired: true };
  };

  const formatTimeLeft = (timeLeft: ReturnType<typeof calculateTimeLeft>) => {
    if (timeLeft.expired) return "Expired";
    
    if (timeLeft.days > 0) {
      return `${timeLeft.days} day${timeLeft.days !== 1 ? 's' : ''}`;
    } else if (timeLeft.hours > 0) {
      return `${timeLeft.hours} hour${timeLeft.hours !== 1 ? 's' : ''}`;
    } else {
      return `${timeLeft.minutes} minute${timeLeft.minutes !== 1 ? 's' : ''}`;
    }
  };

  const getUrgencyColor = (timeLeft: ReturnType<typeof calculateTimeLeft>) => {
    if (timeLeft.expired) return "text-danger";
    if (timeLeft.days <= 1) return "text-danger";
    if (timeLeft.days <= 7) return "text-warning";
    return "text-accent";
  };

  const getUrgencyBg = (timeLeft: ReturnType<typeof calculateTimeLeft>) => {
    if (timeLeft.expired) return "bg-danger/10";
    if (timeLeft.days <= 1) return "bg-danger/10";
    if (timeLeft.days <= 7) return "bg-warning/10";
    return "bg-accent/10";
  };

  // Sort countdowns by date (soonest first)
  const sortedCountdowns = [...countdowns].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const upcomingCount = countdowns.filter(c => !calculateTimeLeft(c.date).expired).length;
  const expiredCount = countdowns.filter(c => calculateTimeLeft(c.date).expired).length;
  const urgentCount = countdowns.filter(c => {
    const timeLeft = calculateTimeLeft(c.date);
    return !timeLeft.expired && timeLeft.days <= 7;
  }).length;

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
                <h1 className="text-xl font-bold">Countdown Clock</h1>
                <p className="text-sm text-muted">Track important dates</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="dashboard-card p-8 mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-danger/20 to-warning/10 rounded-2xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-danger" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Countdown Clock</h2>
              <p className="text-muted">Never miss an important date</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div>
              <p className="text-2xl font-bold text-accent">{upcomingCount}</p>
              <p className="text-sm text-muted">Upcoming</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-warning">{urgentCount}</p>
              <p className="text-sm text-muted">This Week</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-danger">{expiredCount}</p>
              <p className="text-sm text-muted">Expired</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="dashboard-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-8 h-8 text-accent" />
              <div>
                <h3 className="font-semibold">Total Events</h3>
                <p className="text-2xl font-bold text-accent">{countdowns.length}</p>
              </div>
            </div>
            <p className="text-sm text-muted">All countdowns</p>
          </div>

          <div className="dashboard-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-8 h-8 text-warning" />
              <div>
                <h3 className="font-semibold">This Week</h3>
                <p className="text-2xl font-bold text-warning">{urgentCount}</p>
              </div>
            </div>
            <p className="text-sm text-muted">Urgent deadlines</p>
          </div>

          <div className="dashboard-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-8 h-8 text-danger" />
              <div>
                <h3 className="font-semibold">Expired</h3>
                <p className="text-2xl font-bold text-danger">{expiredCount}</p>
              </div>
            </div>
            <p className="text-sm text-muted">Past due dates</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-semibold">Active Countdowns</h3>
          <Button onClick={() => setShowAddForm(true)} className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Countdown
          </Button>
        </div>

        {/* Add Countdown Form */}
        {showAddForm && (
          <div className="dashboard-card p-6 mb-8">
            <h4 className="text-lg font-semibold mb-4">Add New Countdown</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input
                placeholder="Event name"
                value={newCountdown.name}
                onChange={(e) => setNewCountdown(prev => ({ ...prev, name: e.target.value }))}
                className="input-field"
              />
              <Input
                type="date"
                value={newCountdown.date}
                onChange={(e) => setNewCountdown(prev => ({ ...prev, date: e.target.value }))}
                className="input-field"
              />
            </div>
            <Input
              placeholder="Description (optional)"
              value={newCountdown.description}
              onChange={(e) => setNewCountdown(prev => ({ ...prev, description: e.target.value }))}
              className="input-field mb-4"
            />
            <div className="flex gap-2">
              <Button onClick={handleAddCountdown} className="btn-primary">
                Add Countdown
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

        {/* Countdowns List */}
        <div className="space-y-4">
          {sortedCountdowns.map((countdown, index) => {
            const timeLeft = calculateTimeLeft(countdown.date);
            
            return (
              <div 
                key={countdown.id}
                className="dashboard-card p-6 animate-fade-in hover:shadow-lg transition-all group"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getUrgencyBg(timeLeft)}`}>
                        <Clock className={`w-6 h-6 ${getUrgencyColor(timeLeft)}`} />
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold mb-1">{countdown.name}</h4>
                        {countdown.description && (
                          <p className="text-sm text-muted mb-2">{countdown.description}</p>
                        )}
                        
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted">
                            {new Date(countdown.date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                          <span className={`text-lg font-bold ${getUrgencyColor(timeLeft)}`}>
                            {formatTimeLeft(timeLeft)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDelete(countdown.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-danger/10 rounded-lg"
                  >
                    <X className="w-4 h-4 text-danger" />
                  </button>
                </div>
              </div>
            );
          })}
          
          {countdowns.length === 0 && (
            <div className="dashboard-card p-8 text-center">
              <Clock className="w-12 h-12 mx-auto mb-4 text-muted opacity-40" />
              <p className="text-muted mb-4">No countdowns set yet</p>
              <Button onClick={() => setShowAddForm(true)} className="btn-primary">
                Create Your First Countdown
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CountdownsPage;