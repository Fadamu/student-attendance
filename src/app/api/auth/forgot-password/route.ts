import { NextResponse } from "next/server";
import { randomInt, createHash } from "crypto";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetCode } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const identifier =
      typeof body.identifier === "string"
        ? body.identifier.trim()
        : "";

    if (!identifier) {
      return NextResponse.json(
        {
          success: false,
          message: "Enter your email or matric number.",
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

    // Always return the same response so account existence
    // cannot be discovered through this endpoint.
    if (!student) {
      return NextResponse.json({
        success: true,
        message:
          "If an account matches those details, a verification code has been sent to the registered email.",
      });
    }

    // Remove previous unused reset codes for this student.
    await prisma.passwordResetCode.deleteMany({
      where: {
        studentId: student.id,
        usedAt: null,
      },
    });

    const code = randomInt(100000, 1000000).toString();

    const codeHash = createHash("sha256")
      .update(code)
      .digest("hex");

    const expiresAt = new Date(
      Date.now() + 10 * 60 * 1000,
    );

    await prisma.passwordResetCode.create({
      data: {
        studentId: student.id,
        codeHash,
        expiresAt,
      },
    });

    await sendPasswordResetCode(student.email, code);

    return NextResponse.json({
      success: true,
      message:
        "If an account matches those details, a verification code has been sent to the registered email.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to process your request right now. Please try again later.",
      },
      { status: 500 },
    );
  }
}
