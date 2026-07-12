import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary/10 to-primary/10">
      <div className="text-center space-y-6 animate-fade-up">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10">
          <AlertCircle className="w-10 h-10 text-destructive" />
        </div>
        <div>
          <h1 className="text-6xl font-bold text-foreground mb-2">404</h1>
          <p className="text-2xl font-semibold text-foreground mb-2">Page Not Found</p>
          <p className="text-muted-foreground">The page you're looking for doesn't exist or has been moved.</p>
        </div>
        <p className="text-sm text-muted-foreground max-w-sm">
          <code className="bg-secondary/10 px-2 py-1 rounded text-primary">{location.pathname}</code>
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition"
          >
            <Home className="w-5 h-5" />
            Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-2.5 border border-border text-foreground font-medium rounded-lg hover:bg-secondary/5 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
