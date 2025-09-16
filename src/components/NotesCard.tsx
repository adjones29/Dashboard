import { useState, useEffect } from "react";
import { FileText, Save, Trash2, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const NotesCard = () => {
  const [notes, setNotes] = useState("");
  const [isModified, setIsModified] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();

  // Load notes from localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem("dashboard-notes");
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, []);

  // Auto-save after 2 seconds of inactivity
  useEffect(() => {
    if (isModified) {
      const timeoutId = setTimeout(() => {
        handleSave();
      }, 2000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [notes, isModified]);

  const handleNotesChange = (value: string) => {
    setNotes(value);
    setIsModified(true);
  };

  const handleSave = () => {
    localStorage.setItem("dashboard-notes", notes);
    setIsModified(false);
    toast({
      description: "Notes saved",
      duration: 2000,
    });
  };

  const handleClear = () => {
    setNotes("");
    localStorage.removeItem("dashboard-notes");
    setIsModified(false);
    toast({
      description: "Notes cleared",
      duration: 2000,
    });
  };

  return (
    <div className="dashboard-card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-accent/20 to-primary/10 rounded-xl flex items-center justify-center">
            <FileText className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Notes</h3>
            <p className="text-sm text-muted">Quick thoughts & reminders</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            disabled={!isModified}
            className="opacity-60 hover:opacity-100"
          >
            <Save className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="opacity-60 hover:opacity-100 text-danger hover:text-danger"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-60 hover:opacity-100"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl h-[600px]">
              <DialogHeader>
                <DialogTitle>Notes</DialogTitle>
              </DialogHeader>
              <div className="flex-1 mt-4">
                <Textarea
                  value={notes}
                  onChange={(e) => handleNotesChange(e.target.value)}
                  placeholder="Write your notes here..."
                  className="h-full resize-none"
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Notes Content */}
      <div className="space-y-3">
        <Textarea
          value={notes}
          onChange={(e) => handleNotesChange(e.target.value)}
          placeholder="Write your notes here..."
          className="min-h-24 resize-none"
        />
        
        <div className="flex items-center justify-between text-xs text-muted">
          <span>
            {isModified ? "Unsaved changes..." : "Auto-saved"}
          </span>
          <span>{notes.length} characters</span>
        </div>
      </div>
    </div>
  );
};

export default NotesCard;