"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
} from "lucide-react";

export default function AttendancePage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<
    "success" | "error" | ""
  >("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setMessageType("");

    const cleanCode = code.trim();

    if (!/^\d{4}$/.test(cleanCode)) {
      setMessage("Enter the 4-digit attendance code provided by your lecturer.");
      setMessageType("error");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/attendance/check-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: cleanCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Unable to verify attendance code.",
        );
        setMessageType("error");
        return;
      }

      setMessage(
        `${data.session.course.code} — ${data.session.course.name} is active. Attendance session verified.`,
      );
      setMessageType("success");
    } catch {
      setMessage(
        "Something went wrong while checking the attendance code.",
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">
        {/* Main */}
        <section className="min-w-0 flex-1">
          <header className="flex h-20 items-center justify-between border-b border-slate-800 px-6 sm:px-8 lg:px-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-400">
                Student Portal
              </p>

              <h1 className="mt-1 text-xl font-semibold">
                Mark Attendance
              </h1>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-sm font-semibold text-blue-400">
              FS
            </div>
          </header>

          <div className="mx-auto max-w-4xl px-6 py-8 sm:px-8 lg:px-10">
            <Link
              href="/dashboard"
              className="mb-8 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to dashboard
            </Link>

            {/* Heading */}
            <div className="mb-8">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
                <CalendarCheck className="h-6 w-6" />
              </div>

              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Mark your attendance
              </h2>

              <p className="mt-3 max-w-2xl leading-7 text-slate-400">
                Enter the 4-digit attendance code displayed by your
                lecturer to record your presence for the current
                class.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
              {/* Code form */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
                <div className="mb-7">
                  <p className="text-sm font-semibold text-slate-200">
                    Attendance code
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Ask your lecturer for the active class code.
                  </p>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div>
                    <label
                      htmlFor="attendanceCode"
                      className="mb-3 block text-sm font-medium text-slate-300"
                    >
                      Enter code
                    </label>

                    <input
                      id="attendanceCode"
                      name="attendanceCode"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]{4}"
                      maxLength={4}
                      value={code}
                      onChange={(event) =>
                        setCode(
                          event.target.value
                            .replace(/\D/g, "")
                            .slice(0, 4),
                        )
                      }
                      placeholder="0000"
                      autoComplete="off"
                      required
                      className="h-20 w-full rounded-2xl border border-slate-700 bg-slate-950 px-6 text-center text-3xl font-bold tracking-[0.5em] text-white outline-none transition placeholder:text-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>

                  {message && (
                    <div
                      className={`flex gap-3 rounded-2xl border p-4 text-sm ${
                        messageType === "success"
                          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                          : "border-red-500/20 bg-red-500/10 text-red-300"
                      }`}
                    >
                      {messageType === "success" ? (
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                      ) : (
                        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" />
                      )}

                      <p>{message}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || code.length !== 4}
                    className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (
                      "Verifying..."
                    ) : (
                      <>
                        Verify Attendance
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Info card */}
              <div className="space-y-4">
                <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                    <ShieldCheck className="h-5 w-5" />
                  </div>

                  <h3 className="mt-5 font-semibold">
                    Secure check-in
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Your identity comes from your signed-in student
                    account. You only need to provide the lecturer's
                    attendance code.
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                    <Clock3 className="h-5 w-5" />
                  </div>

                  <h3 className="mt-5 font-semibold">
                    Active sessions only
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    The code must belong to an active attendance
                    session and must still be within its valid time.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/40 px-5 py-4 text-sm text-slate-500">
              <span className="font-medium text-slate-300">
                Remember:
              </span>{" "}
              Only enter the code provided by your lecturer. Never
              share your student login credentials.
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

