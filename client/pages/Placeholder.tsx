import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Placeholder() {
  const navigate = useNavigate();
  const location = useLocation();

  const getModuleName = (pathname: string) => {
    const names: Record<string, string> = {
      "/vehicles": "Vehicle Management",
      "/drivers": "Driver Management",
      "/trips": "Trip Management",
      "/maintenance": "Maintenance Management",
      "/expenses": "Fuel & Expense Management",
      "/analytics": "Analytics & Reporting",
    };
    return names[pathname] || "Module";
  };

  const moduleName = getModuleName(location.pathname);

  return (
    <div className="min-h-screen bg-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center space-y-6 animate-fade-up">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-primary/10">
          <div className="w-8 h-8 rounded-full border-3 border-primary/30 border-t-primary animate-spin" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{moduleName}</h1>
          <p className="text-muted-foreground">Coming Soon</p>
        </div>
        <p className="text-muted-foreground max-w-sm mx-auto">
          This module is being built. Continue prompting to fill in the page content, features, and functionality for this section.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Go Back
        </button>
      </div>
    </div>
  );
}
