import { useState } from "react";
import { ArrowLeft, Plus, ExternalLink, Search, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface QuickLink {
  id: string;
  label: string;
  url: string;
  category: string;
  pinned: boolean;
}

const QuickLinksPage = () => {
  const [links, setLinks] = useState<QuickLink[]>([
    // Sample links to get started - user can modify these
    { id: "1", label: "Gmail", url: "https://gmail.com", category: "Personal", pinned: true },
    { id: "2", label: "GitHub", url: "https://github.com", category: "Dev", pinned: true },
    { id: "3", label: "AWS Console", url: "https://console.aws.amazon.com", category: "Work", pinned: false },
    { id: "4", label: "Stack Overflow", url: "https://stackoverflow.com", category: "Dev", pinned: false },
    { id: "5", label: "LinkedIn", url: "https://linkedin.com", category: "Work", pinned: false },
  ]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLink, setNewLink] = useState({ label: "", url: "", category: "Personal" });
  const { toast } = useToast();

  const categories = ["All", ...Array.from(new Set(links.map(link => link.category)))];
  const filteredLinks = links.filter(link => {
    const matchesSearch = link.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         link.url.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || link.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const pinnedLinks = filteredLinks.filter(link => link.pinned);
  const unpinnedLinks = filteredLinks.filter(link => !link.pinned);

  const handleAddLink = () => {
    if (!newLink.label.trim() || !newLink.url.trim()) return;
    
    const link: QuickLink = {
      id: Date.now().toString(),
      label: newLink.label.trim(),
      url: newLink.url.trim(),
      category: newLink.category,
      pinned: false
    };
    
    setLinks(prev => [...prev, link]);
    setNewLink({ label: "", url: "", category: "Personal" });
    setShowAddForm(false);
    
    toast({
      description: "Quick link added successfully",
      duration: 2000,
    });
  };

  const togglePin = (id: string) => {
    setLinks(prev => prev.map(link => 
      link.id === id ? { ...link, pinned: !link.pinned } : link
    ));
  };

  const deleteLink = (id: string) => {
    setLinks(prev => prev.filter(link => link.id !== id));
    toast({
      description: "Quick link removed",
      duration: 2000,
    });
  };

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
                <h1 className="text-xl font-bold">Quick Links</h1>
                <p className="text-sm text-muted">Manage your shortcuts</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-2">Quick Links</h2>
            <p className="text-muted">Access your favorite sites and tools quickly</p>
          </div>
          <Button onClick={() => setShowAddForm(true)} className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Link
          </Button>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted w-4 h-4" />
            <Input 
              placeholder="Search links..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 input-field"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "btn-primary" : ""}
              >
                <Tag className="w-3 h-3 mr-1" />
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Add Link Form */}
        {showAddForm && (
          <div className="dashboard-card p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Add New Link</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Link label"
                value={newLink.label}
                onChange={(e) => setNewLink(prev => ({ ...prev, label: e.target.value }))}
                className="input-field"
              />
              <Input
                placeholder="URL (https://...)"
                value={newLink.url}
                onChange={(e) => setNewLink(prev => ({ ...prev, url: e.target.value }))}
                className="input-field"
              />
              <select
                value={newLink.category}
                onChange={(e) => setNewLink(prev => ({ ...prev, category: e.target.value }))}
                className="input-field"
              >
                <option value="Personal">Personal</option>
                <option value="Work">Work</option>
                <option value="Dev">Dev</option>
                <option value="Finance">Finance</option>
                <option value="Utilities">Utilities</option>
              </select>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleAddLink} className="btn-primary">
                Add Link
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

        {/* Pinned Links */}
        {pinnedLinks.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              📌 Pinned Links
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {pinnedLinks.map(link => (
                <div key={link.id} className="dashboard-card p-4 group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4 text-primary" />
                      <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                        {link.category}
                      </span>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <button
                        onClick={() => togglePin(link.id)}
                        className="btn-ghost p-1 text-xs"
                        title="Unpin"
                      >
                        📌
                      </button>
                      <button
                        onClick={() => deleteLink(link.id)}
                        className="btn-ghost p-1 text-danger text-xs"
                        title="Delete"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block hover:text-primary transition-colors"
                  >
                    <h4 className="font-medium mb-1">{link.label}</h4>
                    <p className="text-xs text-muted truncate">{link.url}</p>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            All Links ({unpinnedLinks.length})
          </h3>
          {unpinnedLinks.length === 0 ? (
            <div className="dashboard-card p-8 text-center">
              <ExternalLink className="w-12 h-12 mx-auto mb-4 text-muted opacity-40" />
              <p className="text-muted mb-4">
                {searchTerm || selectedCategory !== "All" 
                  ? "No links match your search criteria" 
                  : "No links added yet"}
              </p>
              {!searchTerm && selectedCategory === "All" && (
                <Button onClick={() => setShowAddForm(true)} className="btn-primary">
                  Add Your First Link
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {unpinnedLinks.map(link => (
                <div key={link.id} className="dashboard-card p-4 group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4 text-muted" />
                      <span className="text-xs px-2 py-1 bg-muted/20 text-muted rounded-full">
                        {link.category}
                      </span>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <button
                        onClick={() => togglePin(link.id)}
                        className="btn-ghost p-1 text-xs"
                        title="Pin to top"
                      >
                        📌
                      </button>
                      <button
                        onClick={() => deleteLink(link.id)}
                        className="btn-ghost p-1 text-danger text-xs"
                        title="Delete"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block hover:text-primary transition-colors"
                  >
                    <h4 className="font-medium mb-1">{link.label}</h4>
                    <p className="text-xs text-muted truncate">{link.url}</p>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default QuickLinksPage;