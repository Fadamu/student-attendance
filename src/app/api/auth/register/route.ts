import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const fullName =
      typeof body.fullName === "string"
        ? body.fullName.trim()
        : "";

    const matricNumber =
      typeof body.matricNumber === "string"
        ? body.matricNumber.trim()
        : "";

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    const department =
      typeof body.department === "string"
        ? body.department.trim()
        : "";

    const level =
      typeof body.level === "number"
        ? body.level
        : Number(body.level);

    if (!fullName || !matricNumber || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Please complete all required fields.",
        },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 6 characters.",
        },
        { status: 400 },
      );
    }

    if (!Number.isInteger(level) || level < 100 || level > 700) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide a valid academic level.",
        },
        { status: 400 },
      );
    }

    const existingStudent = await prisma.student.findFirst({
      where: {
        OR: [
          { matricNumber },
          { email },
        ],
      },
    });

    if (existingStudent) {
      const field =
        existingStudent.matricNumber === matricNumber
          ? "matric number"
          : "email";

      return NextResponse.json(
        {
          success: false,
          message: `A student with this ${field} already exists.`,
        },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const student = await prisma.student.create({
      data: {
        fullName,
        matricNumber,
        email,
        passwordHash,
        department: department || null,
        level,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Student account created successfully.",
        student: {
          id: student.id,
          fullName: student.fullName,
          matricNumber: student.matricNumber,
          email: student.email,
        },
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to create student account.",
      },
      { status: 500 },
    );
  }
}
