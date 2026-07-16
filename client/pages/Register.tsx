import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, MailCheck, Phone, ShieldCheck, UserRound, UserCog } from "lucide-react";
import { toast } from "sonner";
import BrandLogo from "../components/BrandLogo";

type Role = "Fleet Manager" | "Dispatcher" | "Safety Officer" | "Financial Analyst";

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: Role | "";
};

type FormErrors = Partial<Record<keyof FormState, string>>;

type FormTouched = Partial<Record<keyof FormState, boolean>>;

const initialForm: FormState = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  role: "",
};

const roleOptions: Role[] = ["Fleet Manager", "Dispatcher", "Safety Officer", "Financial Analyst"];
const USERS_KEY = "transitops_users";
const OTP_KEY = "transitops_pending_otp";

const passwordStrengthLabel = (score: number) => {
  if (score <= 2) return { label: "Weak", color: "bg-red-500" };
  if (score === 3) return { label: "Fair", color: "bg-amber-500" };
  if (score === 4) return { label: "Good", color: "bg-sky-500" };
  return { label: "Strong", color: "bg-emerald-500" };
};

export default function Register() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<FormTouched>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");

  const passwordScore = (() => {
    let score = 0;
    const value = form.password;
    if (value.length >= 8) score += 1;
    if (/[A-Z]/.test(value)) score += 1;
    if (/[a-z]/.test(value)) score += 1;
    if (/\d/.test(value)) score += 1;
    if (/[^A-Za-z0-9]/.test(value)) score += 1;
    return score;
  })();

  const strength = passwordStrengthLabel(passwordScore);

  const validateField = (field: keyof FormState, value: string, values: FormState) => {
    switch (field) {
      case "fullName":
        if (!value.trim()) return "Full name is required.";
        if (value.trim().length < 2) return "Please enter at least 2 characters.";
        return "";
      case "email": {
        const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        if (!value.trim()) return "Email address is required.";
        if (!emailValid) return "Enter a valid email address.";
        return "";
      }
      case "phone": {
        if (!value.trim()) return "";
        const phoneValid = /^\+?[0-9\s()-]{7,15}$/.test(value);
        return phoneValid ? "" : "Enter a valid phone number.";
      }
      case "password": {
        if (!value) return "Password is required.";
        if (value.length < 8) return "Use at least 8 characters.";
        if (!/[A-Z]/.test(value) || !/[a-z]/.test(value) || !/\d/.test(value)) {
          return "Include upper, lower, and numeric characters.";
        }
        if (!/[^A-Za-z0-9]/.test(value)) return "Add one special character for better security.";
        return "";
      }
      case "confirmPassword": {
        if (!value) return "Please confirm your password.";
        if (value !== values.password) return "Passwords do not match.";
        return "";
      }
      case "role": {
        if (!value) return "Please select your role.";
        return "";
      }
      default:
        return "";
    }
  };

  const validateForm = (values: FormState) => {
    const nextErrors: FormErrors = {};
    (Object.keys(values) as Array<keyof FormState>).forEach((field) => {
      const message = validateField(field, values[field], values);
      if (message) nextErrors[field] = message;
    });
    return nextErrors;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    const nextValues = { ...form, [name]: value } as FormState;
    setForm(nextValues);

    if (touched[name as keyof FormState]) {
      const fieldError = validateField(name as keyof FormState, value, nextValues);
      setErrors((prev) => ({ ...prev, [name]: fieldError }));
    }

    if (name === "password" || name === "confirmPassword") {
      const passwordError = validateField("password", nextValues.password, nextValues);
      const confirmError = validateField("confirmPassword", nextValues.confirmPassword, nextValues);
      setErrors((prev) => ({ ...prev, password: passwordError, confirmPassword: confirmError }));
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldError = validateField(name as keyof FormState, value, form);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const sendOtp = (email: string) => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const payload = {
      email,
      code,
      expiresAt: Date.now() + 10 * 60 * 1000,
    };

    localStorage.setItem(OTP_KEY, JSON.stringify(payload));
    setPendingEmail(email);
    setOtpValue("");
    setOtpStep(true);

    try {
      navigator.clipboard.writeText(code);
    } catch {
      // Ignore clipboard issues in unsupported environments.
    }

    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent("TransitOps verification code")}&body=${encodeURIComponent(`Your TransitOps verification code is ${code}. It will expire in 10 minutes.`)}`;
    window.open(mailtoLink, "_blank", "noopener,noreferrer");

    toast.success(`A 6-digit code was prepared for ${email}.`);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextTouched: FormTouched = {
      fullName: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true,
      role: true,
    };
    setTouched(nextTouched);

    const nextErrors = validateForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      toast.error("Please fix the highlighted fields to continue.");
      return;
    }

    setIsSubmitting(true);

    window.setTimeout(() => {
      const rawUsers = localStorage.getItem(USERS_KEY);
      const users = rawUsers ? JSON.parse(rawUsers) : [];
      const exists = users.some((user: { email: string }) => user.email.toLowerCase() === form.email.trim().toLowerCase());

      if (exists) {
        toast.error("An account with this email already exists.");
        setIsSubmitting(false);
        return;
      }

      sendOtp(form.email.trim());
      setIsSubmitting(false);
    }, 700);
  };

  const handleOtpSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const rawOtp = localStorage.getItem(OTP_KEY);
      if (!rawOtp) {
        toast.error("The verification code has expired. Please request a new one.");
        setOtpStep(false);
        return;
      }

      const pendingOtp = JSON.parse(rawOtp);
      if (Date.now() > pendingOtp.expiresAt) {
        localStorage.removeItem(OTP_KEY);
        toast.error("The verification code has expired. Please request a new one.");
        setOtpStep(false);
        return;
      }

      if (otpValue.trim() !== pendingOtp.code) {
        toast.error("The verification code is incorrect. Please try again.");
        return;
      }

      const rawUsers = localStorage.getItem(USERS_KEY);
      const users = rawUsers ? JSON.parse(rawUsers) : [];
      const newUser = {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        role: form.role,
        password: form.password,
      };

      users.push(newUser);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      localStorage.removeItem(OTP_KEY);

      const payload = {
        sub: newUser.email,
        name: newUser.fullName,
        role: newUser.role,
        exp: Date.now() + 60 * 60 * 1000,
      };
      const mockToken = `eyJhbGciOiJub25lIn0.${window.btoa(JSON.stringify(payload))}.sig`;

      localStorage.setItem("transitops_token", mockToken);
      localStorage.setItem("transitops_role", newUser.role);
      localStorage.setItem("transitops_user", newUser.fullName);

      toast.success(`Email verified. Welcome aboard, ${newUser.fullName.split(" ")[0]}!`);
      window.location.assign("/dashboard");
    } catch {
      toast.error("We could not complete verification. Please try again.");
    }
  };

  const handleResendOtp = () => {
    sendOtp(form.email.trim());
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.16),_transparent_35%),linear-gradient(135deg,_#f8fbff_0%,_#eef4ff_100%)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 shadow-[0_25px_80px_-24px_rgba(15,23,42,0.35)] backdrop-blur md:flex-row">
        <div className="flex flex-1 flex-col justify-between bg-slate-950 p-8 text-white sm:p-10 lg:p-12">
          <div className="space-y-6">
            <BrandLogo className="gap-3" textClassName="text-xl font-semibold text-white" />
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
                Create your TransitOps account
              </h1>
              <p className="max-w-md text-sm leading-7 text-slate-300 sm:text-base">
                Join the smart operations platform trusted by modern fleets, dispatch teams, and safety leaders.
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-3 rounded-2xl border border-white/10 bg-white/10 p-4 text-sm text-slate-200">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 text-sky-300" />
              <p>Secure registration flow with JWT-ready account setup and role-based access control.</p>
            </div>
            <div className="flex items-start gap-3">
              <UserCog className="mt-0.5 h-5 w-5 text-sky-300" />
              <p>Your selected role becomes part of the access profile for the platform experience.</p>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 sm:p-8 lg:p-10">
          {otpStep ? (
            <form className="space-y-5" onSubmit={handleOtpSubmit} noValidate>
              <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-800">
                <div className="flex items-center gap-2 font-semibold">
                  <MailCheck className="h-4 w-4" />
                  Verify your email
                </div>
                <p className="mt-2 text-sm text-sky-700">
                  We prepared a verification code for <span className="font-semibold">{pendingEmail}</span>.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700" htmlFor="otp">
                  Enter OTP
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  inputMode="numeric"
                  value={otpValue}
                  onChange={(event) => setOtpValue(event.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-lg font-semibold tracking-[0.35em] outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  placeholder="123456"
                />
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
              >
                Verify Email
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="flex items-center justify-between text-sm text-slate-600">
                <p>Code not received?</p>
                <button type="button" onClick={handleResendOtp} className="font-semibold text-sky-700 transition hover:text-sky-800">
                  Resend code
                </button>
              </div>
            </form>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700" htmlFor="fullName">
                Full Name
              </label>
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  value={form.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full rounded-xl border bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition ${errors.fullName && touched.fullName ? "border-red-400 ring-2 ring-red-200" : "border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100"}`}
                  placeholder="Alex Morgan"
                  aria-invalid={Boolean(errors.fullName && touched.fullName)}
                />
              </div>
              {errors.fullName && touched.fullName ? (
                <p className="text-sm text-red-600" role="alert">{errors.fullName}</p>
              ) : null}
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full rounded-xl border bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition ${errors.email && touched.email ? "border-red-400 ring-2 ring-red-200" : "border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100"}`}
                    placeholder="alex@transitops.com"
                    aria-invalid={Boolean(errors.email && touched.email)}
                  />
                </div>
                {errors.email && touched.email ? (
                  <p className="text-sm text-red-600" role="alert">{errors.email}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700" htmlFor="phone">
                  Phone Number <span className="font-normal text-slate-500">(optional)</span>
                </label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full rounded-xl border bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition ${errors.phone && touched.phone ? "border-red-400 ring-2 ring-red-200" : "border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100"}`}
                    placeholder="+1 555 123 4567"
                    aria-invalid={Boolean(errors.phone && touched.phone)}
                  />
                </div>
                {errors.phone && touched.phone ? (
                  <p className="text-sm text-red-600" role="alert">{errors.phone}</p>
                ) : null}
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={form.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full rounded-xl border bg-slate-50 py-3 pl-10 pr-12 text-sm outline-none transition ${errors.password && touched.password ? "border-red-400 ring-2 ring-red-200" : "border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100"}`}
                    placeholder="Create a strong password"
                    aria-invalid={Boolean(errors.password && touched.password)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-700"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {form.password ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                        <div className={`h-2 rounded-full transition-all ${strength.color}`} style={{ width: `${(passwordScore / 5) * 100}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-slate-600">{strength.label}</span>
                    </div>
                  </div>
                ) : null}
                {errors.password && touched.password ? (
                  <p className="text-sm text-red-600" role="alert">{errors.password}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full rounded-xl border bg-slate-50 py-3 pl-10 pr-12 text-sm outline-none transition ${errors.confirmPassword && touched.confirmPassword ? "border-red-400 ring-2 ring-red-200" : "border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100"}`}
                    placeholder="Re-enter password"
                    aria-invalid={Boolean(errors.confirmPassword && touched.confirmPassword)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-700"
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && touched.confirmPassword ? (
                  <p className="text-sm text-red-600" role="alert">{errors.confirmPassword}</p>
                ) : null}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700" htmlFor="role">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={form.role}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full rounded-xl border bg-slate-50 px-4 py-3 text-sm outline-none transition ${errors.role && touched.role ? "border-red-400 ring-2 ring-red-200" : "border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100"}`}
                aria-invalid={Boolean(errors.role && touched.role)}
              >
                <option value="">Select your role</option>
                {roleOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.role && touched.role ? (
                <p className="text-sm text-red-600" role="alert">{errors.role}</p>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Creating account..." : "Create Account"}
              {!isSubmitting ? <ArrowRight className="h-4 w-4" /> : null}
            </button>

              <p className="text-center text-sm text-slate-600">
                Already have an account? {" "}
                <Link to="/login" className="font-semibold text-sky-700 transition hover:text-sky-800">
                  Login
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
