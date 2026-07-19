import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Lock, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import BrandLogo from "../components/BrandLogo";

const API_BASE = "";
const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<"request" | "verify">("request");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const sendResetCode = async () => {
    if (!isValidEmail(email)) {
      toast.error("Enter a valid email address.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/auth/send-reset-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to send reset code.");
      }

      toast.success("A verification code was sent to your email.");
      setStep("verify");
    } catch (error: any) {
      toast.error(error?.message || "Unable to send reset code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isValidEmail(email)) {
      toast.error("Enter a valid email address.");
      return;
    }
    if (code.trim().length !== 6) {
      toast.error("Enter the 6-digit reset code.");
      return;
    }
    if (password.length < 8) {
      toast.error("Choose a password with at least 8 characters.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to reset password.");
      }

      toast.success("Your password has been reset. Please sign in.");
      navigate("/login");
    } catch (error: any) {
      toast.error(error?.message || "Unable to reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg border border-border p-8 space-y-8 animate-fade-up">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <BrandLogo className="items-center justify-center" textClassName="text-2xl font-bold" />
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">Reset your password</p>
              <p className="text-sm text-muted-foreground mt-1">Enter your email and verification code to update your password.</p>
            </div>
          </div>

          <form onSubmit={handleReset} className="space-y-5">
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

            {step === "verify" ? (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground block">Verification Code</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="123456"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground block">New Password</label>
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
              </>
            ) : null}

            <button
              type={step === "request" ? "button" : "submit"}
              onClick={step === "request" ? sendResetCode : undefined}
              disabled={isLoading}
              className="w-full py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
                  {step === "request" ? "Sending code..." : "Resetting..."}
                </>
              ) : (
                <>
                  <ArrowRight className="w-5 h-5" />
                  {step === "request" ? "Send verification code" : "Reset password"}
                </>
              )}
            </button>
          </form>

          <div className="rounded-lg border border-border bg-slate-50 p-4 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">Need help?</p>
            <p className="mt-1">A code will be emailed to you for verified password reset.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
