import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg to-bg/80 flex items-center justify-center p-4">
      <div className="dashboard-card p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl font-bold text-primary">404</span>
        </div>
        
        <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
        <p className="text-muted mb-6">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex gap-3 justify-center">
          <Button 
            onClick={() => window.history.back()} 
            variant="outline"
            className="border-border/40 hover:border-primary/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
          <Button asChild className="btn-primary">
            <a href="/">
              <Home className="w-4 h-4 mr-2" />
              Home
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
