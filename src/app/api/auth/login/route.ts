import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  createSession,
  getSessionCookieName,
} from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const matricNumber =
      typeof body.matricNumber === "string"
        ? body.matricNumber.trim()
        : "";

    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    if (!matricNumber || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Matric number and password are required.",
        },
        { status: 400 },
      );
    }

    const student = await prisma.student.findUnique({
      where: {
        matricNumber,
      },
    });

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid matric number or password.",
        },
        { status: 401 },
      );
    }

    const passwordMatches = await bcrypt.compare(
      password,
      student.passwordHash,
    );

    if (!passwordMatches) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid matric number or password.",
        },
        { status: 401 },
      );
    }

    const token = await createSession(student.id);

    const response = NextResponse.json({
      success: true,
      message: "Login successful.",
      student: {
        id: student.id,
        fullName: student.fullName,
        matricNumber: student.matricNumber,
      },
    });

    response.cookies.set({
      name: getSessionCookieName(),
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to process login.",
      },
      { status: 500 },
    );
  }
}
