import { useEffect, useState } from "react";
import { listCountdowns } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

interface Countdown {
  id: string;
  name: string;
  date: string;
  position: number;
}

const CountdownWidget = () => {
  const [countdowns, setCountdowns] = useState<Countdown[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadCountdowns();
  }, []);

  const loadCountdowns = async () => {
    try {
      const { data, error } = await listCountdowns();
      if (error) throw error;
      setCountdowns(data || []);
    } catch (error) {
      console.error("Error loading countdowns:", error);
      toast({
        title: "Error",
        description: "Failed to load countdowns",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getDaysLeft = (targetDate: string) => {
    const now = new Date();
    const target = new Date(targetDate);
    const diffTime = target.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const upcomingCountdowns = countdowns
    .map(countdown => ({
      ...countdown,
      daysLeft: getDaysLeft(countdown.date)
    }))
    .filter(countdown => countdown.daysLeft >= 0)
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 2);

  if (loading) {
    return (
      <div className="dashboard-card p-6 cursor-pointer hover:shadow-lg transition-shadow"
           onClick={() => window.location.hash = '#/countdowns'}>
        <div className="animate-pulse">
          <div className="h-4 bg-muted/20 rounded mb-2"></div>
          <div className="h-8 bg-muted/20 rounded mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-muted/20 rounded"></div>
            <div className="h-3 bg-muted/20 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
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
        {upcomingCountdowns.length > 0 ? (
          <>
            <div className="space-y-1">
              {upcomingCountdowns.map(countdown => (
                <div key={countdown.id} className="flex justify-between text-sm">
                  <span className="truncate mr-2">{countdown.name}</span>
                  <span className={`font-semibold ${
                    countdown.daysLeft <= 7 ? 'text-danger' : 
                    countdown.daysLeft <= 30 ? 'text-warning' : 'text-accent'
                  }`}>
                    {countdown.daysLeft === 0 ? 'Today' :
                     countdown.daysLeft === 1 ? '1 day' :
                     `${countdown.daysLeft} days`}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted">{countdowns.length} countdowns active</span>
              <span className="text-primary hover:underline">View all →</span>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-muted">No upcoming countdowns</p>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted">Add your first countdown</span>
              <span className="text-primary hover:underline">Get started →</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CountdownWidget;