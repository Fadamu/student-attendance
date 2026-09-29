"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [matricNumber, setMatricNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          matricNumber,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to sign in.");
        return;
      }

      window.location.href = "/dashboard";
    } catch {
      setError("Something went wrong. Please try again.");
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
                Stay on top of your
                <span className="block text-blue-500">
                  attendance.
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-lg leading-8 text-slate-400">
                Access your attendance records, mark your presence,
                and keep track of your academic attendance from one
                secure portal.
              </p>

              <div className="mt-10 grid max-w-lg grid-cols-3 gap-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                  <p className="text-2xl font-bold">01</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Secure Login
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                  <p className="text-2xl font-bold">02</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Enter Code
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                  <p className="text-2xl font-bold">03</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Get Confirmed
                  </p>
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-600">
              Student Attendance Portal
            </p>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <div className="mb-10 lg:hidden">
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
                WELCOME BACK
              </p>

              <h2 className="text-3xl font-bold tracking-tight">
                Sign in to your account
              </h2>

              <p className="mt-3 text-slate-400">
                Use your student credentials to access the portal.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="matricNumber"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Matric Number
                </label>

                <input
                  id="matricNumber"
                  name="matricNumber"
                  type="text"
                  value={matricNumber}
                  onChange={(event) =>
                    setMatricNumber(event.target.value)
                  }
                  placeholder="e.g. 2024/12345"
                  autoComplete="username"
                  required
                  className="h-13 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-200"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-sm text-blue-400 transition hover:text-blue-300"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className="h-13 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 pr-20 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
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

              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-400">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-700 bg-slate-900 accent-blue-600"
                />
                Remember me
              </label>

              <button
                type="submit"
                disabled={loading}
                className="h-13 w-full rounded-xl bg-blue-600 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <div className="my-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-800" />
              <span className="text-xs text-slate-600">
                SECURE PORTAL
              </span>
              <div className="h-px flex-1 bg-slate-800" />
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
              <p className="text-sm font-medium text-slate-300">
                Don't have an account?
              </p>

              <Link
                href="/register"
                className="mt-1 block text-sm text-blue-400 transition hover:text-blue-300"
              >
                Create your student account
              </Link>
            </div>

            <Link
              href="/"
              className="mt-8 block text-center text-sm text-slate-500 transition hover:text-slate-300"
            >
              Back to home
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
