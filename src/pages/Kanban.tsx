import { useEffect, useState } from "react";
import { Sun, Moon, Search, RefreshCw, User, Plus, Edit, Trash2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

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

const Kanban = () => {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);
  const [cards, setCards] = useState<KanbanCard[]>([]);
  const [filteredCards, setFilteredCards] = useState<KanbanCard[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<KanbanCard | null>(null);
  const [newCard, setNewCard] = useState({
    title: "",
    description: "",
    status: "backlog" as const,
    tags: "",
    due_date: ""
  });
  const { toast } = useToast();

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("dashboard-theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
    
    setTheme(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);
  }, []);

  // Load cards from localStorage
  useEffect(() => {
    const savedCards = localStorage.getItem("kanban-cards");
    if (savedCards) {
      try {
        const parsedCards = JSON.parse(savedCards);
        setCards(parsedCards);
      } catch (error) {
        console.error("Error parsing saved cards:", error);
      }
    }
  }, []);

  // Filter cards based on search and tag
  useEffect(() => {
    let filtered = cards;
    
    if (searchTerm) {
      filtered = filtered.filter(card => 
        card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedTag !== "all") {
      filtered = filtered.filter(card => card.tags.includes(selectedTag));
    }
    
    setFilteredCards(filtered);
  }, [cards, searchTerm, selectedTag]);

  // Save cards to localStorage
  const saveCards = (updatedCards: KanbanCard[]) => {
    setCards(updatedCards);
    localStorage.setItem("kanban-cards", JSON.stringify(updatedCards));
  };

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

  const handleAddCard = () => {
    if (!newCard.title.trim()) return;

    const maxPosition = Math.max(
      ...cards.filter(c => c.status === newCard.status).map(c => c.position),
      -1
    );

    const card: KanbanCard = {
      id: Date.now().toString(),
      title: newCard.title.trim(),
      description: newCard.description.trim() || undefined,
      status: newCard.status,
      position: maxPosition + 1,
      tags: newCard.tags ? newCard.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
      due_date: newCard.due_date || undefined,
      created_at: new Date().toISOString(),
    };

    saveCards([...cards, card]);
    setNewCard({ title: "", description: "", status: "backlog", tags: "", due_date: "" });
    setIsAddCardOpen(false);
    
    toast({
      description: `Card added to ${COLUMN_CONFIG[newCard.status].title}`,
      duration: 2000,
    });
  };

  const handleUpdateCard = () => {
    if (!editingCard || !editingCard.title.trim()) return;

    const updatedCards = cards.map(card => 
      card.id === editingCard.id ? editingCard : card
    );
    
    saveCards(updatedCards);
    setEditingCard(null);
    
    toast({
      description: "Card updated successfully",
      duration: 2000,
    });
  };

  const handleDeleteCard = (cardId: string) => {
    const updatedCards = cards.filter(card => card.id !== cardId);
    saveCards(updatedCards);
    
    toast({
      description: "Card deleted",
      duration: 2000,
    });
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceStatus = source.droppableId as KanbanCard['status'];
    const destinationStatus = destination.droppableId as KanbanCard['status'];

    const updatedCards = [...cards];
    const cardToMove = updatedCards.find(card => card.id === result.draggableId);
    
    if (!cardToMove) return;

    // Remove card from source
    const sourceCards = updatedCards.filter(card => 
      card.status === sourceStatus && card.id !== cardToMove.id
    );
    
    // Update positions in source column
    sourceCards
      .sort((a, b) => a.position - b.position)
      .forEach((card, index) => {
        const cardIndex = updatedCards.findIndex(c => c.id === card.id);
        if (cardIndex !== -1) {
          updatedCards[cardIndex].position = index;
        }
      });

    // Update moved card
    const movedCardIndex = updatedCards.findIndex(c => c.id === cardToMove.id);
    if (movedCardIndex !== -1) {
      updatedCards[movedCardIndex].status = destinationStatus;
      updatedCards[movedCardIndex].position = destination.index;
    }

    // Update positions in destination column
    const destinationCards = updatedCards.filter(card => 
      card.status === destinationStatus
    ).sort((a, b) => a.position - b.position);

    destinationCards.forEach((card, index) => {
      const cardIndex = updatedCards.findIndex(c => c.id === card.id);
      if (cardIndex !== -1) {
        updatedCards[cardIndex].position = index;
      }
    });

    saveCards(updatedCards);
    
    if (sourceStatus !== destinationStatus) {
      toast({
        description: `Card moved to ${COLUMN_CONFIG[destinationStatus].title}`,
        duration: 2000,
      });
    }
  };

  const getCardsByStatus = (status: KanbanCard['status']) => {
    return filteredCards
      .filter(card => card.status === status)
      .sort((a, b) => a.position - b.position);
  };

  const getAllTags = () => {
    const allTags = cards.flatMap(card => card.tags);
    return Array.from(new Set(allTags));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg to-bg/80 transition-all duration-500">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-border/40">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo & Navigation */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold">Kanban Board</h1>
                <div className="flex gap-2 text-sm">
                  <button 
                    onClick={() => window.location.hash = '#/'}
                    className="text-muted hover:text-primary transition-colors"
                  >
                    Dashboard
                  </button>
                  <span className="text-muted">/</span>
                  <span className="text-foreground">Kanban</span>
                </div>
              </div>
            </div>

            {/* Center: Search */}
            <div className="flex-1 max-w-md mx-8 hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted w-4 h-4" />
                <Input 
                  placeholder="Search cards..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-surface/50 border-border/40 focus:border-primary/50"
                />
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center space-x-2">
              <Select value={selectedTag} onValueChange={setSelectedTag}>
                <SelectTrigger className="w-32 bg-surface/50 border-border/40">
                  <SelectValue placeholder="Filter by tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All tags</SelectItem>
                  {getAllTags().map(tag => (
                    <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => window.location.reload()}
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
        {/* Toolbar */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold">Project Board</h2>
            <Badge variant="outline" className="text-sm">
              {cards.length} cards
            </Badge>
          </div>
          
          <Dialog open={isAddCardOpen} onOpenChange={setIsAddCardOpen}>
            <DialogTrigger asChild>
              <Button className="btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Card
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Card</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <Input
                  value={newCard.title}
                  onChange={(e) => setNewCard(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Card title..."
                  className="input-field"
                />
                <Input
                  value={newCard.description}
                  onChange={(e) => setNewCard(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description (optional)..."
                  className="input-field"
                />
                <Select value={newCard.status} onValueChange={(value: any) => setNewCard(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger className="input-field">
                    <SelectValue placeholder="Select column" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(COLUMN_CONFIG).map(([status, config]) => (
                      <SelectItem key={status} value={status}>
                        {config.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  value={newCard.tags}
                  onChange={(e) => setNewCard(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="Tags (comma separated)..."
                  className="input-field"
                />
                <Input
                  type="date"
                  value={newCard.due_date}
                  onChange={(e) => setNewCard(prev => ({ ...prev, due_date: e.target.value }))}
                  className="input-field"
                />
                <Button onClick={handleAddCard} className="btn-primary w-full">
                  Add Card
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Kanban Board */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(COLUMN_CONFIG).map(([status, config]) => {
              const columnCards = getCardsByStatus(status as KanbanCard['status']);
              
              return (
                <div key={status} className="dashboard-card p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`font-semibold ${config.textColor}`}>
                      {config.title}
                    </h3>
                    <Badge variant="outline" className="text-xs">
                      {columnCards.length}
                    </Badge>
                  </div>
                  
                  <Droppable droppableId={status}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`space-y-3 min-h-[400px] p-2 rounded-lg transition-colors ${
                          snapshot.isDraggingOver ? config.color : 'bg-transparent'
                        }`}
                      >
                        {columnCards.map((card, index) => (
                          <Draggable key={card.id} draggableId={card.id} index={index}>
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
                                    {card.title}
                                  </h4>
                                  <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                      onClick={() => setEditingCard(card)}
                                      className="btn-ghost p-1 mr-1"
                                    >
                                      <Edit className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteCard(card.id)}
                                      className="btn-ghost p-1"
                                    >
                                      <Trash2 className="w-3 h-3 text-danger" />
                                    </button>
                                  </div>
                                </div>
                                
                                {card.description && (
                                  <p className="text-xs text-muted mb-2">{card.description}</p>
                                )}
                                
                                {card.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mb-2">
                                    {card.tags.map(tag => (
                                      <Badge key={tag} variant="secondary" className="text-xs px-1 py-0">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                                
                                {card.due_date && (
                                  <div className="flex items-center text-xs text-muted mt-2">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {new Date(card.due_date).toLocaleDateString()}
                                  </div>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        
                        {columnCards.length === 0 && (
                          <div className="text-center py-8 text-muted text-sm opacity-50">
                            Drop cards here
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

        {/* Edit Card Dialog */}
        <Dialog open={!!editingCard} onOpenChange={() => setEditingCard(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Card</DialogTitle>
            </DialogHeader>
            {editingCard && (
              <div className="space-y-4 mt-4">
                <Input
                  value={editingCard.title}
                  onChange={(e) => setEditingCard(prev => prev ? { ...prev, title: e.target.value } : null)}
                  placeholder="Card title..."
                  className="input-field"
                />
                <Input
                  value={editingCard.description || ""}
                  onChange={(e) => setEditingCard(prev => prev ? { ...prev, description: e.target.value } : null)}
                  placeholder="Description (optional)..."
                  className="input-field"
                />
                <Select value={editingCard.status} onValueChange={(value: any) => setEditingCard(prev => prev ? { ...prev, status: value } : null)}>
                  <SelectTrigger className="input-field">
                    <SelectValue placeholder="Select column" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(COLUMN_CONFIG).map(([status, config]) => (
                      <SelectItem key={status} value={status}>
                        {config.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  value={editingCard.tags.join(', ')}
                  onChange={(e) => setEditingCard(prev => prev ? { ...prev, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) } : null)}
                  placeholder="Tags (comma separated)..."
                  className="input-field"
                />
                <Input
                  type="date"
                  value={editingCard.due_date || ""}
                  onChange={(e) => setEditingCard(prev => prev ? { ...prev, due_date: e.target.value } : null)}
                  className="input-field"
                />
                <Button onClick={handleUpdateCard} className="btn-primary w-full">
                  Update Card
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