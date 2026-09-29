import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedStudent } from "@/lib/current-student";
import { CalendarDays, CheckCircle2, Clock3 } from "lucide-react";

export default async function HistoryPage() {
  const student = await getAuthenticatedStudent();

  if (!student) {
    redirect("/login");
  }

  const records = await prisma.attendanceRecord.findMany({
    where: {
      studentId: student.id,
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

  const total = records.length;
  const present = records.filter(
    (record) => record.status === "PRESENT",
  ).length;

  const percentage =
    total > 0 ? Math.round((present / total) * 100) : 0;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-10">
          <p className="mb-2 text-sm font-medium text-blue-400">
            ATTENDANCE RECORD
          </p>

          <h1 className="text-3xl font-bold tracking-tight">
            My Attendance
          </h1>

          <p className="mt-2 text-slate-400">
            View your complete attendance history.
          </p>
        </div>

        <section className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
              <CalendarDays className="h-5 w-5 text-blue-400" />
            </div>

            <p className="text-sm text-slate-400">Total attendance</p>

            <p className="mt-1 text-3xl font-bold">
              {total}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            </div>

            <p className="text-sm text-slate-400">Present</p>

            <p className="mt-1 text-3xl font-bold">
              {present}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
              <Clock3 className="h-5 w-5 text-violet-400" />
            </div>

            <p className="text-sm text-slate-400">
              Attendance rate
            </p>

            <p className="mt-1 text-3xl font-bold">
              {percentage}%
            </p>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
          <div className="border-b border-slate-800 px-6 py-5">
            <h2 className="font-semibold">
              Attendance history
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              {student.fullName} · {student.matricNumber}
            </p>
          </div>

          {records.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <CalendarDays className="mx-auto h-10 w-10 text-slate-600" />

              <h3 className="mt-4 font-semibold">
                No attendance records yet
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Your attendance records will appear here after
                you check in to a course.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {records.map((record) => (
                <div
                  key={record.id}
                  className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold">
                      {record.session.course.code}
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      {record.session.course.name}
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-sm text-slate-300">
                        {record.checkedInAt.toLocaleDateString()}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {record.checkedInAt.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      Present
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
