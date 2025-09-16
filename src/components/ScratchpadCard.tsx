import { useState, useEffect } from "react";
import { FileText, Save, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const ScratchpadCard = () => {
  const [content, setContent] = useState("");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { toast } = useToast();

  // Load saved content on mount
  useEffect(() => {
    const saved = localStorage.getItem("dashboard-scratchpad");
    const saveTime = localStorage.getItem("dashboard-scratchpad-time");
    
    if (saved) {
      setContent(saved);
      if (saveTime) {
        setLastSaved(new Date(saveTime));
      }
    }
  }, []);

  // Track changes
  useEffect(() => {
    const saved = localStorage.getItem("dashboard-scratchpad") || "";
    setHasUnsavedChanges(content !== saved);
  }, [content]);

  // Auto-save every 10 seconds if there are changes
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const autoSaveInterval = setInterval(() => {
      handleSave(true);
    }, 10000);

    return () => clearInterval(autoSaveInterval);
  }, [hasUnsavedChanges, content]);

  const handleSave = (isAutoSave = false) => {
    if (!hasUnsavedChanges) return;
    
    const now = new Date();
    localStorage.setItem("dashboard-scratchpad", content);
    localStorage.setItem("dashboard-scratchpad-time", now.toISOString());
    
    setLastSaved(now);
    setHasUnsavedChanges(false);
    
    if (!isAutoSave) {
      toast({
        description: "Notes saved successfully",
        duration: 2000,
      });
    }
  };

  const handleClear = () => {
    setContent("");
    localStorage.removeItem("dashboard-scratchpad");
    localStorage.removeItem("dashboard-scratchpad-time");
    setLastSaved(null);
    setHasUnsavedChanges(false);
    
    toast({
      description: "Scratchpad cleared",
      duration: 2000,
    });
  };

  const formatLastSaved = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="dashboard-card p-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-muted/10 rounded-xl flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Scratchpad Notes</h2>
            <p className="text-sm text-muted">
              {hasUnsavedChanges ? (
                <span className="text-warning">Unsaved changes</span>
              ) : lastSaved ? (
                `Saved ${formatLastSaved(lastSaved)}`
              ) : (
                "No saved notes"
              )}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleClear}
            className="border-border/40 hover:border-danger/50 text-danger"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          
          <Button 
            onClick={() => handleSave(false)}
            disabled={!hasUnsavedChanges}
            className={hasUnsavedChanges ? "btn-primary" : "bg-muted text-muted-foreground cursor-not-allowed"}
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      {/* Textarea */}
      <div className="relative">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Jot down ideas, thoughts, reminders..."
          className="input-field min-h-[200px] resize-none text-sm leading-relaxed"
        />
        
        {/* Character Count */}
        <div className="absolute bottom-3 right-3 text-xs text-muted bg-background/80 px-2 py-1 rounded">
          {content.length} chars
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-4 flex gap-2 flex-wrap">
        <button
          onClick={() => setContent(content + `\n\n## ${new Date().toLocaleDateString()}\n- `)}
          className="text-xs px-3 py-1 bg-muted/20 hover:bg-muted/40 rounded-lg transition-colors"
        >
          + Daily Note
        </button>
        <button
          onClick={() => setContent(content + `\n\n### TODO\n- [ ] `)}
          className="text-xs px-3 py-1 bg-muted/20 hover:bg-muted/40 rounded-lg transition-colors"
        >
          + TODO List
        </button>
        <button
          onClick={() => setContent(content + `\n\n### Meeting Notes\n**Date:** ${new Date().toLocaleDateString()}\n**Attendees:** \n**Notes:**\n- `)}
          className="text-xs px-3 py-1 bg-muted/20 hover:bg-muted/40 rounded-lg transition-colors"
        >
          + Meeting Notes
        </button>
      </div>

      {/* Auto-save Indicator */}
      {hasUnsavedChanges && (
        <div className="mt-3 text-xs text-muted flex items-center gap-2">
          <div className="w-2 h-2 bg-warning rounded-full animate-pulse" />
          Auto-save in progress...
        </div>
      )}
    </div>
  );
};

export default ScratchpadCard;