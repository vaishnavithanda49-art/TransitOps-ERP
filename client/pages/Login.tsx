import { Link } from "react-router-dom";
import { useState } from "react";
import { Mail, Lock, LogIn } from "lucide-react";
import { toast } from "sonner";
import BrandLogo from "../components/BrandLogo";

type StoredUser = {
  fullName: string;
  email: string;
  phone: string;
  role: string;
  password: string;
};

const USERS_KEY = "transitops_users";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    window.setTimeout(() => {
      try {
        const rawUsers = localStorage.getItem(USERS_KEY);
        const users: StoredUser[] = rawUsers ? JSON.parse(rawUsers) : [];
        const match = users.find((user) => user.email.toLowerCase() === email.trim().toLowerCase() && user.password === password);

        if (!match) {
          toast.error("We could not find an account with those details.");
          setIsLoading(false);
          return;
        }

        const payload = {
          sub: match.email,
          name: match.fullName,
          role: match.role,
          exp: Date.now() + 60 * 60 * 1000,
        };
        const mockToken = `eyJhbGciOiJub25lIn0.${window.btoa(JSON.stringify(payload))}.sig`;

        localStorage.setItem("transitops_token", mockToken);
        localStorage.setItem("transitops_role", match.role);
        localStorage.setItem("transitops_user", match.fullName);
        toast.success(`Welcome back, ${match.fullName.split(" ")[0]}!`);
        window.location.assign("/dashboard");
      } catch {
        toast.error("Something went wrong while signing you in.");
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-lg shadow-lg border border-border p-8 space-y-8 animate-fade-up">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <BrandLogo className="items-center justify-center" textClassName="text-2xl font-bold" />
            </div>
            <p className="text-sm text-muted-foreground mt-2">Smart Transport Operations Platform</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white"
                  required
                />
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-border" />
                <span className="text-muted-foreground">Remember me</span>
              </label>
              <a href="#" className="text-primary hover:text-primary/80 transition font-medium">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="rounded-lg border border-border bg-slate-50 p-4 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">Secure sign-in</p>
            <p className="mt-1">Use the email address and password from your verified TransitOps account.</p>
          </div>

          {/* Footer */}
          <div className="text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              Don't have an account? <Link to="/register" className="text-primary hover:text-primary/80 transition font-medium">Sign up</Link>
            </p>
            <Link
              to="/"
              className="text-sm text-primary hover:text-primary/80 transition font-medium inline-block"
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
