import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const secret = process.env.SESSION_SECRET;

if (!secret) {
  throw new Error("SESSION_SECRET is not configured.");
}

const secretKey = new TextEncoder().encode(secret);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const resetToken =
      typeof body.resetToken === "string"
        ? body.resetToken
        : "";

    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    if (!resetToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Your password reset session is invalid.",
        },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Your new password must be at least 8 characters.",
        },
        { status: 400 },
      );
    }

    let payload;

    try {
      const result = await jwtVerify(
        resetToken,
        secretKey,
      );

      payload = result.payload;
    } catch {
      return NextResponse.json(
        {
          success: false,
          message:
            "Your password reset session has expired. Please request a new code.",
        },
        { status: 401 },
      );
    }

    if (
      payload.purpose !== "password-reset" ||
      typeof payload.studentId !== "string" ||
      typeof payload.resetCodeId !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid password reset session.",
        },
        { status: 401 },
      );
    }

    const resetCode =
      await prisma.passwordResetCode.findUnique({
        where: {
          id: payload.resetCodeId,
        },
      });

    if (
      !resetCode ||
      resetCode.studentId !== payload.studentId ||
      resetCode.usedAt ||
      resetCode.expiresAt <= new Date()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This password reset session is no longer valid.",
        },
        { status: 401 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.$transaction([
      prisma.student.update({
        where: {
          id: payload.studentId,
        },
        data: {
          passwordHash,
        },
      }),

      prisma.passwordResetCode.update({
        where: {
          id: resetCode.id,
        },
        data: {
          usedAt: new Date(),
        },
      }),

      prisma.passwordResetCode.deleteMany({
        where: {
          studentId: payload.studentId,
          id: {
            not: resetCode.id,
          },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to reset your password right now. Please try again.",
      },
      { status: 500 },
    );
  }
}