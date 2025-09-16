import { useState, useEffect } from "react";
import { Plus, X, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface CountdownItem {
  id: string;
  name: string;
  date: string;
  days: number;
}

const CountdownCard = () => {
  const [countdowns, setCountdowns] = useState<CountdownItem[]>([
    { id: "1", name: "Browns Game", date: "2025-09-21", days: 4 },
    { id: "2", name: "Birthday/Golf outing", date: "2025-09-25", days: 8 },
    { id: "3", name: "St Louis trip", date: "2025-11-03", days: 47 },
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [newCountdown, setNewCountdown] = useState({ name: "", date: "" });
  const { toast } = useToast();

  // Calculate days remaining
  const calculateDays = (targetDate: string) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Update countdown days
  useEffect(() => {
    setCountdowns(prev => prev.map(countdown => ({
      ...countdown,
      days: calculateDays(countdown.date)
    })));
  }, []);

  const handleAdd = () => {
    if (!newCountdown.name || !newCountdown.date) return;
    
    const countdown: CountdownItem = {
      id: Date.now().toString(),
      name: newCountdown.name,
      date: newCountdown.date,
      days: calculateDays(newCountdown.date)
    };
    
    setCountdowns(prev => [...prev, countdown]);
    setNewCountdown({ name: "", date: "" });
    setIsOpen(false);
    
    toast({
      description: `Added countdown for ${newCountdown.name}`,
      duration: 3000,
    });
  };

  const handleDelete = (id: string) => {
    setCountdowns(prev => prev.filter(c => c.id !== id));
    toast({
      description: "Countdown removed",
      duration: 2000,
    });
  };

  return (
    <div className="dashboard-card p-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-accent/10 rounded-xl flex items-center justify-center">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl font-semibold">Countdown Clock</h2>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Countdown
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Countdown</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="name">Event Name</Label>
                <Input
                  id="name"
                  value={newCountdown.name}
                  onChange={(e) => setNewCountdown(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter event name..."
                  className="input-field"
                />
              </div>
              <div>
                <Label htmlFor="date">Target Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newCountdown.date}
                  onChange={(e) => setNewCountdown(prev => ({ ...prev, date: e.target.value }))}
                  className="input-field"
                />
              </div>
              <Button onClick={handleAdd} className="btn-primary w-full">
                Create Countdown
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Countdown Grid */}
      <div className="space-y-4">
        {countdowns.map((countdown, index) => (
          <div 
            key={countdown.id}
            className="countdown-tile animate-fade-in relative group"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <button
              onClick={() => handleDelete(countdown.id)}
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity btn-ghost p-1"
            >
              <X className="w-4 h-4 text-danger" />
            </button>
            
            <div className="pr-8">
              <div className="font-semibold text-foreground mb-1">{countdown.name}</div>
              <div className="flex items-center gap-2 text-sm text-muted mb-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(countdown.date).toLocaleDateString()}</span>
              </div>
              <div className="text-2xl font-bold">
                <span className="text-primary">{countdown.days}</span>
                <span className="text-sm font-normal text-muted ml-1">
                  {countdown.days === 1 ? 'day' : 'days'}
                </span>
              </div>
            </div>
          </div>
        ))}
        
        {countdowns.length === 0 && (
          <div className="text-center py-8 text-muted">
            <Clock className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p>No countdowns yet. Add your first event!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CountdownCard;