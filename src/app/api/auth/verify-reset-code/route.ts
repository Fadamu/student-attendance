import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { SignJWT } from "jose";
import { prisma } from "@/lib/prisma";

const secret = process.env.SESSION_SECRET;

if (!secret) {
  throw new Error("SESSION_SECRET is not configured.");
}

const secretKey = new TextEncoder().encode(secret);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const identifier =
      typeof body.identifier === "string"
        ? body.identifier.trim()
        : "";

    const code =
      typeof body.code === "string"
        ? body.code.trim()
        : "";

    if (!identifier || !/^\d{6}$/.test(code)) {
      return NextResponse.json(
        {
          success: false,
          message: "Enter a valid 6-digit verification code.",
        },
        { status: 400 },
      );
    }

    const student = await prisma.student.findFirst({
      where: {
        OR: [
          {
            email: identifier.toLowerCase(),
          },
          {
            matricNumber: identifier,
          },
        ],
      },
    });

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired verification code.",
        },
        { status: 400 },
      );
    }

    const resetCode =
      await prisma.passwordResetCode.findFirst({
        where: {
          studentId: student.id,
          usedAt: null,
          expiresAt: {
            gt: new Date(),
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    if (!resetCode) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired verification code.",
        },
        { status: 400 },
      );
    }

    const codeHash = createHash("sha256")
      .update(code)
      .digest("hex");

    if (codeHash !== resetCode.codeHash) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired verification code.",
        },
        { status: 400 },
      );
    }

    const resetToken = await new SignJWT({
      studentId: student.id,
      resetCodeId: resetCode.id,
      purpose: "password-reset",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("10m")
      .sign(secretKey);

    return NextResponse.json({
      success: true,
      resetToken,
    });
  } catch (error) {
    console.error("Verify reset code error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to verify the code right now. Please try again.",
      },
      { status: 500 },
    );
  }
}