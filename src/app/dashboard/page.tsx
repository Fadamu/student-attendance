import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  LogOut,
  XCircle,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedStudent } from "@/lib/current-student";
import { getSessionCookieName } from "@/lib/auth";

async function logout() {
  "use server";

  const cookieStore = await cookies();
  cookieStore.delete(getSessionCookieName());

  redirect("/login");
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default async function DashboardPage() {
  const student = await getAuthenticatedStudent();

  if (!student) {
    redirect("/login");
  }

  const enrollments = await prisma.enrollment.findMany({
    where: {
      studentId: student.id,
    },
    include: {
      course: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const courseIds = enrollments.map(
    (enrollment) => enrollment.courseId,
  );

  const now = new Date();

  const sessions = await prisma.attendanceSession.findMany({
    where: {
      courseId: {
        in: courseIds.length > 0 ? courseIds : ["__none__"],
      },
      startsAt: {
        lte: now,
      },
    },
    include: {
      course: true,
    },
    orderBy: {
      startsAt: "desc",
    },
  });

  const attendanceRecords =
    await prisma.attendanceRecord.findMany({
      where: {
        studentId: student.id,
        session: {
          courseId: {
            in: courseIds.length > 0 ? courseIds : ["__none__"],
          },
        },
      },
      include: {
        session: {
          include: {
            course: true,
          },
        },
      },
      orderBy: {
        checkedInAt: "desc",
      },
    });

  const attendedCount = attendanceRecords.length;
  const totalSessions = sessions.length;
  const missedCount = Math.max(
    totalSessions - attendedCount,
    0,
  );

  const attendanceRate =
    totalSessions > 0
      ? Math.round((attendedCount / totalSessions) * 100)
      : 0;

  const recentAttendance = attendanceRecords.slice(0, 5);

  const initials = getInitials(student.fullName);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">
        <section className="min-w-0 flex-1">
          <header className="flex h-20 items-center justify-between border-b border-slate-800 px-6 sm:px-8 lg:px-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-400">
                Student Portal
              </p>

              <h1 className="mt-1 text-xl font-semibold">
                Dashboard
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/attendance"
                className="hidden items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold transition hover:bg-blue-500 sm:flex"
              >
                <CalendarCheck className="h-4 w-4" />
                Mark Attendance
              </Link>

              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-sm font-semibold text-blue-400">
                {initials || "ST"}
              </div>

              <form action={logout}>
                <button
                  type="submit"
                  className="flex h-10 items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3 text-sm font-medium text-slate-400 transition hover:border-slate-700 hover:text-white"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    Logout
                  </span>
                </button>
              </form>
            </div>
          </header>

          <div className="mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-10">
            <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 p-7 sm:p-9">
              <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl" />

              <div className="relative">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                  Student Portal
                </div>

                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Welcome back, {student.fullName}.
                </h2>

                <p className="mt-3 max-w-2xl leading-7 text-slate-400">
                  Keep track of your attendance and make sure your
                  academic record stays up to date.
                </p>

                <Link
                  href="/attendance"
                  className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-500"
                >
                  Mark attendance
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">
                    Attendance Rate
                  </p>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                    <CalendarCheck className="h-5 w-5" />
                  </div>
                </div>

                <p className="mt-5 text-3xl font-bold">
                  {attendanceRate}%
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  Overall attendance
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">
                    Attended
                  </p>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                </div>

                <p className="mt-5 text-3xl font-bold">
                  {attendedCount}
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  Sessions attended
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">
                    Not Attended
                  </p>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                    <XCircle className="h-5 w-5" />
                  </div>
                </div>

                <p className="mt-5 text-3xl font-bold">
                  {missedCount}
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  Sessions missed
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">
                    Courses
                  </p>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                    <BookOpen className="h-5 w-5" />
                  </div>
                </div>

                <p className="mt-5 text-3xl font-bold">
                  {enrollments.length}
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  Registered courses
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60">
              <div className="flex items-center justify-between border-b border-slate-800 px-5 py-5 sm:px-6">
                <div>
                  <h3 className="font-semibold">
                    Recent attendance
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Your latest attendance activity
                  </p>
                </div>

                <Link
                  href="/history"
                  className="flex items-center gap-1 text-sm font-medium text-blue-400 transition hover:text-blue-300"
                >
                  View all
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {recentAttendance.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <CalendarCheck className="mx-auto h-8 w-8 text-slate-700" />

                  <p className="mt-3 font-medium text-slate-400">
                    No attendance records yet
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    Your attendance activity will appear here.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-800">
                  {recentAttendance.map((record) => (
                    <div
                      key={record.id}
                      className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-xs font-bold text-blue-400">
                          {record.session.course.code
                            .split(" ")
                            .slice(-1)[0]}
                        </div>

                        <div>
                          <p className="font-medium">
                            {record.session.course.name}
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
                            {record.session.course.code} ·{" "}
                            {record.checkedInAt.toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 sm:justify-end">
                        <div className="flex items-center gap-1.5 text-sm text-slate-500">
                          <Clock3 className="h-4 w-4" />
                          {record.checkedInAt.toLocaleTimeString(
                            "en-US",
                            {
                              hour: "numeric",
                              minute: "2-digit",
                            },
                          )}
                        </div>

                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Attended
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 lg:hidden">
              <Link
                href="/attendance"
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm font-medium text-slate-300 transition hover:border-slate-700 hover:text-white"
              >
                <CalendarCheck className="h-4 w-4" />
                Attendance
              </Link>

              <Link
                href="/history"
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm font-medium text-slate-300 transition hover:border-slate-700 hover:text-white"
              >
                <BookOpen className="h-4 w-4" />
                History
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
