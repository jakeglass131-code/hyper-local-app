"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";

type AccountType = "consumer" | "provider";

type SignUpFormValues = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  accountType: AccountType;
  acceptTerms: boolean;
};

type FormErrors = Partial<Record<keyof SignUpFormValues, string>>;

const initialValues: SignUpFormValues = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  accountType: "consumer",
  acceptTerms: false,
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignUpFormPage() {
  const router = useRouter();
  const [values, setValues] = useState<SignUpFormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const passwordStrength = useMemo(() => {
    const value = values.password;
    if (!value) return { label: "Not set", color: "bg-slate-200", width: "w-0" };
    if (value.length < 8) return { label: "Weak", color: "bg-red-400", width: "w-1/3" };
    if (!/[A-Z]/.test(value) || !/[0-9]/.test(value)) {
      return { label: "Medium", color: "bg-amber-400", width: "w-2/3" };
    }
    return { label: "Strong", color: "bg-emerald-500", width: "w-full" };
  }, [values.password]);

  const setField = <K extends keyof SignUpFormValues>(key: K, value: SignUpFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
    if (submitMessage) setSubmitMessage("");
  };

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {};

    if (!values.fullName.trim()) nextErrors.fullName = "Full name is required.";
    if (!values.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!emailRegex.test(values.email)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!values.phone.trim()) {
      nextErrors.phone = "Mobile number is required.";
    } else if (values.phone.replace(/[^\d]/g, "").length < 10) {
      nextErrors.phone = "Please enter a valid mobile number.";
    }

    if (!values.password) {
      nextErrors.password = "Password is required.";
    } else if (values.password.length < 8) {
      nextErrors.password = "Use at least 8 characters.";
    }

    if (!values.confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your password.";
    } else if (values.confirmPassword !== values.password) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    if (!values.acceptTerms) {
      nextErrors.acceptTerms = "You must accept the terms and privacy policy.";
    }

    return nextErrors;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setErrors({});
    setSubmitMessage("");

    try {
      localStorage.setItem(
        "hyper-local-signup-draft",
        JSON.stringify({
          fullName: values.fullName,
          email: values.email,
          phone: values.phone,
          accountType: values.accountType,
          createdAt: Date.now(),
        })
      );

      setSubmitMessage("Account created. You can now log in.");
      setTimeout(() => router.push("/login"), 700);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell role={values.accountType === "provider" ? "merchant" : "consumer"}>
      <div className="mx-auto w-full max-w-lg">
        <div className="rounded-[2rem] border border-white/[0.08] bg-white/[0.03] p-6 shadow-2xl backdrop-blur-2xl sm:p-8">
          <p className="inline-flex rounded-full bg-[#3744D2]/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#c7ceff]">
            Create Account
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Join Hyper Local
          </h1>
          <p className="mt-2 text-sm text-white/60">
            Sign up in under a minute to discover local deals and redeem instantly.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-semibold text-white/80">Full Name</label>
              <input
                type="text"
                value={values.fullName}
                onChange={(event) => setField("fullName", event.target.value)}
                placeholder="Jane Walker"
                className="mt-1.5 w-full rounded-xl border border-white/[0.1] bg-white/[0.04] px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#3744D2]"
              />
              {errors.fullName ? <p className="mt-1 text-xs text-red-600">{errors.fullName}</p> : null}
            </div>

            <div>
              <label className="text-sm font-semibold text-white/80">Email</label>
              <input
                type="email"
                value={values.email}
                onChange={(event) => setField("email", event.target.value)}
                placeholder="you@example.com"
                className="mt-1.5 w-full rounded-xl border border-white/[0.1] bg-white/[0.04] px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#3744D2]"
              />
              {errors.email ? <p className="mt-1 text-xs text-red-600">{errors.email}</p> : null}
            </div>

            <div>
              <label className="text-sm font-semibold text-white/80">Mobile Number</label>
              <input
                type="tel"
                value={values.phone}
                onChange={(event) => setField("phone", event.target.value)}
                placeholder="+1 202 555 0192"
                className="mt-1.5 w-full rounded-xl border border-white/[0.1] bg-white/[0.04] px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#3744D2]"
              />
              {errors.phone ? <p className="mt-1 text-xs text-red-600">{errors.phone}</p> : null}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setField("accountType", "consumer")}
                className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${values.accountType === "consumer"
                  ? "border-[#3744D2] bg-[#3744D2]/20 text-[#c7ceff]"
                  : "border-white/[0.1] bg-white/[0.03] text-white/70 hover:bg-white/[0.06]"
                  }`}
              >
                Consumer Account
              </button>
              <button
                type="button"
                onClick={() => setField("accountType", "provider")}
                className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${values.accountType === "provider"
                  ? "border-[#3744D2] bg-[#3744D2]/20 text-[#c7ceff]"
                  : "border-white/[0.1] bg-white/[0.03] text-white/70 hover:bg-white/[0.06]"
                  }`}
              >
                Merchant Account
              </button>
            </div>

            <div>
              <label className="text-sm font-semibold text-white/80">Password</label>
              <div className="mt-1.5 flex items-center rounded-xl border border-white/[0.1] bg-white/[0.04] pr-2 focus-within:border-[#3744D2]">
                <input
                  type={showPassword ? "text" : "password"}
                  value={values.password}
                  onChange={(event) => setField("password", event.target.value)}
                  placeholder="Create a password"
                  className="w-full rounded-xl bg-transparent px-3.5 py-3 text-sm text-white outline-none placeholder:text-white/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="rounded-lg p-1.5 text-white/70 hover:bg-white/[0.08]"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-white/10">
                <div className={`h-1.5 rounded-full transition-all ${passwordStrength.color} ${passwordStrength.width}`} />
              </div>
              <p className="mt-1 text-xs text-white/55">Password strength: {passwordStrength.label}</p>
              {errors.password ? <p className="mt-1 text-xs text-red-600">{errors.password}</p> : null}
            </div>

            <div>
              <label className="text-sm font-semibold text-white/80">Confirm Password</label>
              <div className="mt-1.5 flex items-center rounded-xl border border-white/[0.1] bg-white/[0.04] pr-2 focus-within:border-[#3744D2]">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={values.confirmPassword}
                  onChange={(event) => setField("confirmPassword", event.target.value)}
                  placeholder="Re-enter password"
                  className="w-full rounded-xl bg-transparent px-3.5 py-3 text-sm text-white outline-none placeholder:text-white/30"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="rounded-lg p-1.5 text-white/70 hover:bg-white/[0.08]"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword ? <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p> : null}
            </div>

            <label className="flex items-start gap-2 rounded-xl border border-white/[0.1] bg-white/[0.03] px-3 py-3">
              <input
                type="checkbox"
                checked={values.acceptTerms}
                onChange={(event) => setField("acceptTerms", event.target.checked)}
                className="mt-0.5 h-4 w-4 accent-[#3744D2]"
              />
              <span className="text-xs leading-relaxed text-white/70">
                I agree to the{" "}
                <Link href="/terms" className="font-semibold text-[#3744D2] underline underline-offset-2">
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="font-semibold text-[#3744D2] underline underline-offset-2">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
            {errors.acceptTerms ? <p className="text-xs text-red-600">{errors.acceptTerms}</p> : null}

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3744D2] px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#3744D2]/20 transition hover:bg-[#2d36ab] disabled:opacity-70"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>

            {submitMessage ? <p className="text-sm font-medium text-emerald-600">{submitMessage}</p> : null}
          </form>

          <p className="mt-6 text-center text-sm text-white/55">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[#3744D2] hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </AuthShell>
  );
}
