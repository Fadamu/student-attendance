"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: "",
    matricNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
    level: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  function updateField(
    field: keyof typeof form,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setMessageType("");

    if (form.password !== form.confirmPassword) {
      setMessage("Passwords do not match.");
      setMessageType("error");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: form.fullName,
          matricNumber: form.matricNumber,
          email: form.email,
          password: form.password,
          department: form.department,
          level: Number(form.level),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to create your account.");
        setMessageType("error");
        return;
      }

      setMessage(
        "Account created successfully. Redirecting you to login...",
      );
      setMessageType("success");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1200);
    } catch {
      setMessage(
        "Something went wrong. Please try again.",
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="relative hidden overflow-hidden lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.25),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.12),transparent_35%)]" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
            <Link href="/" className="flex w-fit items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 font-bold">
                SA
              </div>

              <div>
                <p className="font-semibold">Student Attendance</p>
                <p className="text-xs text-slate-400">
                  Attendance Portal
                </p>
              </div>
            </Link>

            <div className="max-w-xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
                <span className="h-2 w-2 rounded-full bg-blue-400" />
                Student Portal
              </div>

              <h1 className="text-5xl font-bold leading-tight xl:text-6xl">
                Create your
                <span className="block text-blue-500">
                  student account.
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-lg leading-8 text-slate-400">
                Register once with your student information and
                use your account to securely access the attendance
                portal.
              </p>

              <div className="mt-10 space-y-4 max-w-lg">
                {[
                  ["01", "Enter your student information"],
                  ["02", "Create your secure account"],
                  ["03", "Start marking attendance"],
                ].map(([number, text]) => (
                  <div
                    key={number}
                    className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-4"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600/10 text-sm font-bold text-blue-400">
                      {number}
                    </span>

                    <p className="text-sm text-slate-300">
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-sm text-slate-600">
              Student Attendance Portal
            </p>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-6 py-12">
          <div className="w-full max-w-xl">
            <div className="mb-8 lg:hidden">
              <Link href="/" className="flex w-fit items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 font-bold">
                  SA
                </div>

                <div>
                  <p className="font-semibold">Student Attendance</p>
                  <p className="text-xs text-slate-400">
                    Attendance Portal
                  </p>
                </div>
              </Link>
            </div>

            <div className="mb-8">
              <p className="mb-3 text-sm font-medium text-blue-400">
                CREATE ACCOUNT
              </p>

              <h2 className="text-3xl font-bold tracking-tight">
                Register as a student
              </h2>

              <p className="mt-3 text-slate-400">
                Enter your student information to create your portal
                account.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Full Name
                </label>

                <input
                  id="fullName"
                  value={form.fullName}
                  onChange={(event) =>
                    updateField("fullName", event.target.value)
                  }
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
                  className="h-13 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="matricNumber"
                    className="mb-2 block text-sm font-medium text-slate-200"
                  >
                    Matric Number
                  </label>

                  <input
                    id="matricNumber"
                    value={form.matricNumber}
                    onChange={(event) =>
                      updateField(
                        "matricNumber",
                        event.target.value,
                      )
                    }
                    placeholder="e.g. 2024/12345"
                    autoComplete="username"
                    required
                    className="h-13 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="level"
                    className="mb-2 block text-sm font-medium text-slate-200"
                  >
                    Academic Level
                  </label>

                  <select
                    id="level"
                    value={form.level}
                    onChange={(event) =>
                      updateField("level", event.target.value)
                    }
                    required
                    className="h-13 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                  >
                    <option value="">Select level</option>
                    <option value="100">100 Level</option>
                    <option value="200">200 Level</option>
                    <option value="300">300 Level</option>
                    <option value="400">400 Level</option>
                    <option value="500">500 Level</option>
                    <option value="600">600 Level</option>
                    <option value="700">700 Level</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    updateField("email", event.target.value)
                  }
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="h-13 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                />
              </div>

              <div>
                <label
                  htmlFor="department"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Department
                </label>

                <input
                  id="department"
                  value={form.department}
                  onChange={(event) =>
                    updateField(
                      "department",
                      event.target.value,
                    )
                  }
                  placeholder="e.g. Computer Science"
                  required
                  className="h-13 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-slate-200"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(event) =>
                        updateField(
                          "password",
                          event.target.value,
                        )
                      }
                      placeholder="Create a password"
                      autoComplete="new-password"
                      required
                      className="h-13 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 pr-16 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500 transition hover:text-slate-300"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-medium text-slate-200"
                  >
                    Confirm Password
                  </label>

                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      value={form.confirmPassword}
                      onChange={(event) =>
                        updateField(
                          "confirmPassword",
                          event.target.value,
                        )
                      }
                      placeholder="Repeat your password"
                      autoComplete="new-password"
                      required
                      className="h-13 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 pr-16 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword,
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500 transition hover:text-slate-300"
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
              </div>

              {message && (
                <div
                  className={`rounded-xl border px-4 py-3 text-sm ${
                    messageType === "success"
                      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                      : "border-red-500/20 bg-red-500/10 text-red-300"
                  }`}
                >
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="h-13 w-full rounded-xl bg-blue-600 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-blue-400 transition hover:text-blue-300"
              >
                Sign in
              </Link>
            </p>

            <Link
              href="/"
              className="mt-6 block text-center text-sm text-slate-600 transition hover:text-slate-400"
            >
              Back to home
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
