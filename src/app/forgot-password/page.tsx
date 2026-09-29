"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

type Step = "request" | "verify" | "reset" | "success";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("request");
  const [identifier, setIdentifier] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function requestCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message ?? "Unable to process your request.");
        return;
      }

      setMessage(
        "If an account matches those details, a 6-digit verification code has been sent to the registered email.",
      );

      setStep("verify");
    } catch {
      setError(
        "Unable to connect to the server. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function verifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!/^\d{6}$/.test(code)) {
      setError("Enter the 6-digit verification code.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/auth/verify-reset-code",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            identifier,
            code,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message ?? "Invalid verification code.");
        return;
      }

      sessionStorage.setItem(
        "passwordResetToken",
        data.resetToken,
      );

      setStep("reset");
    } catch {
      setError(
        "Unable to connect to the server. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function resetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (password.length < 8) {
      setError(
        "Your new password must be at least 8 characters.",
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    const resetToken = sessionStorage.getItem(
      "passwordResetToken",
    );

    if (!resetToken) {
      setError(
        "Your verification session has expired. Please request a new code.",
      );
      setStep("request");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resetToken,
            password,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message ?? "Unable to reset password.");
        return;
      }

      sessionStorage.removeItem("passwordResetToken");
      setStep("success");
    } catch {
      setError(
        "Unable to connect to the server. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-6 py-12">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl lg:grid-cols-[0.9fr_1.1fr]">
          <section className="hidden border-r border-slate-800 bg-gradient-to-br from-blue-950 via-slate-900 to-slate-950 p-10 lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/20">
                <ShieldCheck className="h-6 w-6" />
              </div>

              <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
                Student Portal
              </p>

              <h1 className="mt-4 text-4xl font-bold tracking-tight">
                Secure account recovery.
              </h1>

              <p className="mt-5 leading-7 text-slate-400">
                Verify your identity using a code sent to your
                registered email, then create a new password.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <Mail className="h-4 w-4 text-blue-400" />
                Verification by email
              </div>

              <div className="flex items-center gap-3 text-sm text-slate-400">
                <KeyRound className="h-4 w-4 text-blue-400" />
                One-time verification code
              </div>

              <div className="flex items-center gap-3 text-sm text-slate-400">
                <LockKeyhole className="h-4 w-4 text-blue-400" />
                Secure password reset
              </div>
            </div>
          </section>

          <section className="p-7 sm:p-10">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Link>

            {step === "request" && (
              <div className="mt-12">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
                  <Mail className="h-6 w-6" />
                </div>

                <h2 className="mt-6 text-3xl font-bold">
                  Forgot your password?
                </h2>

                <p className="mt-3 leading-6 text-slate-400">
                  Enter your email address or matric number and
                  we&apos;ll send a verification code to your
                  registered email.
                </p>

                <form
                  onSubmit={requestCode}
                  className="mt-8 space-y-5"
                >
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Email or matric number
                    </label>

                    <input
                      value={identifier}
                      onChange={(event) =>
                        setIdentifier(event.target.value)
                      }
                      required
                      autoComplete="username"
                      placeholder="e.g. 20230001 or you@example.com"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-600 focus:border-blue-500"
                    />
                  </div>

                  {error && (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading
                      ? "Sending code..."
                      : "Send verification code"}
                    {!loading && (
                      <ArrowRight className="h-4 w-4" />
                    )}
                  </button>
                </form>
              </div>
            )}

            {step === "verify" && (
              <div className="mt-12">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
                  <KeyRound className="h-6 w-6" />
                </div>

                <h2 className="mt-6 text-3xl font-bold">
                  Enter your code
                </h2>

                <p className="mt-3 leading-6 text-slate-400">
                  Enter the 6-digit code sent to your registered
                  email address. The code expires in 10 minutes.
                </p>

                {message && (
                  <div className="mt-5 rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 py-3 text-sm leading-6 text-blue-300">
                    {message}
                  </div>
                )}

                <form
                  onSubmit={verifyCode}
                  className="mt-8 space-y-5"
                >
                  <input
                    value={code}
                    onChange={(event) =>
                      setCode(
                        event.target.value
                          .replace(/\D/g, "")
                          .slice(0, 6),
                      )
                    }
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="000000"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-4 text-center text-3xl font-bold tracking-[0.5em] outline-none transition placeholder:text-slate-700 focus:border-blue-500"
                  />

                  {error && (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || code.length !== 6}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading
                      ? "Verifying..."
                      : "Verify code"}
                    {!loading && (
                      <ArrowRight className="h-4 w-4" />
                    )}
                  </button>
                </form>

                <button
                  type="button"
                  onClick={() => {
                    setStep("request");
                    setCode("");
                    setError("");
                    setMessage("");
                  }}
                  className="mt-5 w-full text-sm text-slate-500 transition hover:text-slate-300"
                >
                  Use a different email or matric number
                </button>
              </div>
            )}

            {step === "reset" && (
              <div className="mt-12">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
                  <LockKeyhole className="h-6 w-6" />
                </div>

                <h2 className="mt-6 text-3xl font-bold">
                  Create a new password
                </h2>

                <p className="mt-3 leading-6 text-slate-400">
                  Choose a strong password you&apos;ll remember.
                </p>

                <form
                  onSubmit={resetPassword}
                  className="mt-8 space-y-5"
                >
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      New password
                    </label>

                    <input
                      type="password"
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      required
                      minLength={8}
                      autoComplete="new-password"
                      placeholder="At least 8 characters"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-600 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Confirm new password
                    </label>

                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                      required
                      minLength={8}
                      autoComplete="new-password"
                      placeholder="Repeat your new password"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-600 focus:border-blue-500"
                    />
                  </div>

                  {error && (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading
                      ? "Updating password..."
                      : "Update password"}
                    {!loading && (
                      <ArrowRight className="h-4 w-4" />
                    )}
                  </button>
                </form>
              </div>
            )}

            {step === "success" && (
              <div className="mt-12 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                  <CheckCircle2 className="h-8 w-8" />
                </div>

                <h2 className="mt-6 text-3xl font-bold">
                  Password updated
                </h2>

                <p className="mt-3 leading-6 text-slate-400">
                  Your password has been changed successfully.
                  You can now sign in with your new password.
                </p>

                <Link
                  href="/login"
                  className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold transition hover:bg-blue-500"
                >
                  Back to login
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}