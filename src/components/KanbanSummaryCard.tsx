import { useState, useEffect } from "react";
import { Columns3, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  status: 'backlog' | 'in_progress' | 'blocked' | 'done';
  position: number;
  tags: string[];
  due_date?: string;
  created_at: string;
  user_id?: string;
}

const COLUMN_CONFIG = {
  backlog: { title: "Backlog", color: "bg-muted/50", textColor: "text-muted-foreground" },
  in_progress: { title: "In Progress", color: "bg-primary/10", textColor: "text-primary" },
  blocked: { title: "Blocked", color: "bg-danger/10", textColor: "text-danger" },
  done: { title: "Done", color: "bg-accent/10", textColor: "text-accent" }
};

const KanbanSummaryCard = () => {
  const [cards, setCards] = useState<KanbanCard[]>([]);

  // Load cards from localStorage
  useEffect(() => {
    const savedCards = localStorage.getItem("kanban-cards");
    if (savedCards) {
      try {
        const parsedCards = JSON.parse(savedCards);
        setCards(parsedCards);
      } catch (error) {
        console.error("Error parsing saved kanban cards:", error);
      }
    }
  }, []);

  const getColumnCounts = () => {
    const counts = {
      backlog: cards.filter(card => card.status === 'backlog').length,
      in_progress: cards.filter(card => card.status === 'in_progress').length,
      blocked: cards.filter(card => card.status === 'blocked').length,
      done: cards.filter(card => card.status === 'done').length,
    };
    return counts;
  };

  const getRecentCards = () => {
    return cards
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 3);
  };

  const counts = getColumnCounts();
  const recentCards = getRecentCards();

  const getStatusColor = (status: KanbanCard['status']) => {
    switch (status) {
      case 'in_progress': return 'text-primary';
      case 'blocked': return 'text-danger';
      case 'done': return 'text-accent';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBg = (status: KanbanCard['status']) => {
    switch (status) {
      case 'in_progress': return 'bg-primary/10';
      case 'blocked': return 'bg-danger/10';
      case 'done': return 'bg-accent/10';
      default: return 'bg-muted/20';
    }
  };

  return (
    <div className="dashboard-card p-6 cursor-pointer hover:shadow-lg transition-shadow"
         onClick={() => window.location.hash = '#/kanban'}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-warning/10 rounded-xl flex items-center justify-center">
            <Columns3 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Kanban Overview</h3>
            <p className="text-sm text-muted">Track your work</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={(e) => {
            e.stopPropagation();
            window.location.hash = '#/kanban';
          }}
          className="opacity-60 hover:opacity-100"
        >
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Column Counts */}
      <div className="space-y-3 mb-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted">Backlog</span>
            <Badge variant="outline" className="text-xs">
              {counts.backlog}
            </Badge>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-primary">In Progress</span>
            <Badge variant="outline" className="text-xs text-primary">
              {counts.in_progress}
            </Badge>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-danger">Blocked</span>
            <Badge variant="outline" className="text-xs text-danger">
              {counts.blocked}
            </Badge>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-accent">Done</span>
            <Badge variant="outline" className="text-xs text-accent">
              {counts.done}
            </Badge>
          </div>
        </div>
      </div>

      {/* Recent Cards */}
      {recentCards.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted">Recent Cards</h4>
          {recentCards.map(card => (
            <div key={card.id} className="flex items-center justify-between p-2 bg-surface/50 rounded-lg">
              <span className="text-sm text-foreground truncate flex-1 pr-2">
                {card.title}
              </span>
              <Badge 
                variant="outline" 
                className={`text-xs ${getStatusColor(card.status)} ${getStatusBg(card.status)}`}
              >
                {COLUMN_CONFIG[card.status].title}
              </Badge>
            </div>
          ))}
        </div>
      )}

      {recentCards.length === 0 && (
        <div className="text-center py-4 text-muted text-sm opacity-50">
          No cards yet. Click to create your first card!
        </div>
      )}

      <div className="flex justify-between items-center text-sm mt-4 pt-3 border-t border-border/20">
        <span className="text-muted">{cards.length} total cards</span>
        <span className="text-primary hover:underline">Open Kanban →</span>
      </div>
    </div>
  );
};

export default KanbanSummaryCard;