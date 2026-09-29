import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.22),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.14),transparent_35%)]" />

        <div className="relative z-10 w-full max-w-6xl">
          <nav className="mb-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 font-bold">
                SA
              </div>

              <div>
                <p className="font-semibold">Student Attendance</p>
                <p className="text-xs text-slate-400">Attendance Portal</p>
              </div>
            </div>

            <Link
              href="/login"
              className="rounded-lg border border-slate-700 px-5 py-2.5 text-sm font-medium transition hover:border-blue-500 hover:bg-blue-500/10"
            >
              Student Login
            </Link>
          </nav>

          <div className="grid items-center gap-16 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
                <span className="h-2 w-2 rounded-full bg-blue-400" />
                Student Attendance Portal
              </div>

              <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
                Your attendance.
                <span className="block text-blue-500">Simplified.</span>
              </h1>

              <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-400">
                Mark your attendance quickly using the session code provided
                by your lecturer and keep track of your attendance history
                from one place.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/login"
                  className="inline-flex h-13 items-center justify-center rounded-xl bg-blue-600 px-7 font-semibold transition hover:bg-blue-500"
                >
                  Login to Portal
                  <span className="ml-3 text-lg">→</span>
                </Link>

                <Link
                  href="/attendance"
                  className="inline-flex h-13 items-center justify-center rounded-xl border border-slate-700 px-7 font-semibold transition hover:border-slate-500"
                >
                  Mark Attendance
                </Link>
              </div>

              <div className="mt-12 flex flex-wrap gap-8 border-t border-slate-800 pt-8">
                <div>
                  <p className="text-2xl font-bold">01</p>
                  <p className="mt-1 text-sm text-slate-500">Login</p>
                </div>

                <div className="h-10 w-px bg-slate-800" />

                <div>
                  <p className="text-2xl font-bold">02</p>
                  <p className="mt-1 text-sm text-slate-500">Enter Code</p>
                </div>

                <div className="h-10 w-px bg-slate-800" />

                <div>
                  <p className="text-2xl font-bold">03</p>
                  <p className="mt-1 text-sm text-slate-500">
                    You&apos;re Present
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 rounded-[2rem] bg-blue-600/10 blur-3xl" />

              <div className="relative rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">
                      Student Dashboard
                    </p>
                    <p className="mt-1 text-lg font-semibold">
                      Good afternoon
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
                    ✓
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    Attendance rate
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-4xl font-bold">86%</p>

                    <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-blue-500/20 border-t-blue-500 text-sm font-semibold">
                      86%
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                    <p className="text-xs text-slate-500">Present</p>
                    <p className="mt-2 text-2xl font-bold">24</p>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                    <p className="text-xs text-slate-500">Missed</p>
                    <p className="mt-2 text-2xl font-bold">4</p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl bg-blue-600 p-5">
                  <p className="text-sm text-blue-100">
                    Have an attendance code?
                  </p>
                  <p className="mt-1 font-semibold">
                    Mark your attendance →
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-20 text-center text-sm text-slate-600">
            Student Attendance Portal • Secure • Simple • Connected
          </p>
        </div>
      </section>
    </main>
  );
}