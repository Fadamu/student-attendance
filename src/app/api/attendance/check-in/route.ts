import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedStudent } from "@/lib/current-student";

export async function POST(request: Request) {
  try {
    const student = await getAuthenticatedStudent();

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          message: "You must be logged in to mark attendance.",
        },
        { status: 401 },
      );
    }

    const body = await request.json();

    const code =
      typeof body.code === "string"
        ? body.code.trim()
        : "";

    if (!/^\d{4}$/.test(code)) {
      return NextResponse.json(
        {
          success: false,
          message: "Enter a valid 4-digit attendance code.",
        },
        { status: 400 },
      );
    }

    const session =
      await prisma.attendanceSession.findUnique({
        where: {
          code,
        },
        include: {
          course: true,
        },
      });

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid attendance code.",
        },
        { status: 404 },
      );
    }

    const now = new Date();

    if (
      session.status !== "ACTIVE" ||
      now < session.startsAt ||
      now > session.expiresAt
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This attendance session is no longer active.",
        },
        { status: 410 },
      );
    }

    const enrollment =
      await prisma.enrollment.findUnique({
        where: {
          studentId_courseId: {
            studentId: student.id,
            courseId: session.courseId,
          },
        },
      });

    if (!enrollment) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You are not enrolled in this course.",
        },
        { status: 403 },
      );
    }

    const existingRecord =
      await prisma.attendanceRecord.findUnique({
        where: {
          sessionId_studentId: {
            sessionId: session.id,
            studentId: student.id,
          },
        },
      });

    if (existingRecord) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You have already marked attendance for this session.",
        },
        { status: 409 },
      );
    }

    const record =
      await prisma.attendanceRecord.create({
        data: {
          sessionId: session.id,
          studentId: student.id,
          status: "PRESENT",
          checkedInAt: now,
        },
      });

    return NextResponse.json({
      success: true,
      message: "Attendance marked successfully.",
      attendance: {
        id: record.id,
        checkedInAt: record.checkedInAt,
        status: record.status,
        student: {
          fullName: student.fullName,
          matricNumber: student.matricNumber,
        },
        course: {
          code: session.course.code,
          name: session.course.name,
        },
      },
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to process attendance check-in.",
      },
      { status: 500 },
    );
  }
}
